import { pool } from '../config/db.js';

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
    try {
        // ORDER BY createdAt DESC — newest first
        const [rows] = await pool.execute('SELECT * FROM leads ORDER BY createdAt DESC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single lead by ID
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = async (req, res) => {
    try {
        // Parameterized query prevents SQL injection
        const [rows] = await pool.execute('SELECT * FROM leads WHERE id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
    try {
        const { fullName, email, phone, company, source, status = 'new', notes = '' } = req.body;

        // Basic validation
        if (!fullName || !email || !phone || !company || !source) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        const [result] = await pool.execute(
            `INSERT INTO leads (fullName, email, phone, company, source, status, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [fullName, email, phone, company, source, status, notes]
        );

        // Fetch the newly created lead to return it in full
        const [newLead] = await pool.execute('SELECT * FROM leads WHERE id = ?', [result.insertId]);
        res.status(201).json(newLead[0]);
    } catch (error) {
        res.status(400).json({ message: 'Invalid lead data', error: error.message });
    }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
    try {
        const { fullName, email, phone, company, source, status, notes } = req.body;

        // Check if lead exists first
        const [existing] = await pool.execute('SELECT * FROM leads WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        const lead = existing[0];

        // Only update provided fields, fall back to existing values
        await pool.execute(
            `UPDATE leads 
             SET fullName = ?, email = ?, phone = ?, company = ?, source = ?, status = ?, notes = ?
             WHERE id = ?`,
            [
                fullName  || lead.fullName,
                email     || lead.email,
                phone     || lead.phone,
                company   || lead.company,
                source    || lead.source,
                status    || lead.status,
                notes     !== undefined ? notes : lead.notes,
                req.params.id
            ]
        );

        // Return updated lead
        const [updatedLead] = await pool.execute('SELECT * FROM leads WHERE id = ?', [req.params.id]);
        res.status(200).json(updatedLead[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
    try {
        const [existing] = await pool.execute('SELECT * FROM leads WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        await pool.execute('DELETE FROM leads WHERE id = ?', [req.params.id]);
        res.status(200).json({ message: 'Lead successfully removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export { getLeads, getLeadById, createLead, updateLead, deleteLead };
