import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    AppBar,
    Toolbar,
} from '@mui/material';
import { FilterList as FilterListIcon, CloudUpload as CloudUploadIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { api } from '../services/api';
import { Lead, FilterState } from '../types';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [filters, setFilters] = useState<FilterState>({});
    const [openFilter, setOpenFilter] = useState<string | null>(null);
    const [filterValue, setFilterValue] = useState('');
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const username = localStorage.getItem('username') || '';

    const handleLogout = () => {
        localStorage.removeItem('username');
        navigate('/');
    };

    const fetchLeads = useCallback(async () => {
        try {
            const data = await api.getLeads(username, filters);
            setLeads(data);
        } catch (error) {
            console.error('Error fetching leads:', error);
        }
    }, [username, filters]);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    const handleFilterClick = (column: string) => {
        setOpenFilter(column);
        setFilterValue(filters[column as keyof FilterState] || '');
    };

    const handleFilterApply = () => {
        if (openFilter) {
            setFilters(prev => ({
                ...prev,
                [openFilter]: filterValue
            }));
        }
        setOpenFilter(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        setUploadError(null);

        const files = e.dataTransfer.files;
        if (files.length === 0) return;

        const file = files[0];
        if (!file.name.endsWith('.csv')) {
            setUploadError('Please upload a CSV file');
            return;
        }

        try {
            // Create a FormData object to send the file
            const formData = new FormData();
            formData.append('file', file);

            // Send the file to the backend
            await api.importCSV(username, file);
            setShowImportDialog(false);
            fetchLeads();
        } catch (error) {
            console.error('Error importing CSV:', error);
            setUploadError('Failed to import CSV file');
        }
    };

    const columns = [
        { id: 'lead_id', label: 'Lead ID' },
        { id: 'lead_name', label: 'Lead Name' },
        { id: 'contact_information', label: 'Contact Information' },
        { id: 'source', label: 'Source' },
        { id: 'interest_level', label: 'Interest Level' },
        { id: 'status', label: 'Status' },
        { id: 'salesperson', label: 'Salesperson' },
    ];

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="default" elevation={1}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Welcome, {username}
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={handleLogout}
                        startIcon={<LogoutIcon />}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4">Leads Dashboard</Typography>
                    <Button
                        variant="contained"
                        onClick={() => setShowImportDialog(true)}
                        startIcon={<CloudUploadIcon />}
                    >
                        Import CSV
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {column.label}
                                            <IconButton
                                                size="small"
                                                onClick={() => handleFilterClick(column.id)}
                                            >
                                                <FilterListIcon />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leads.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell>{lead.lead_id}</TableCell>
                                    <TableCell>{lead.lead_name}</TableCell>
                                    <TableCell>{lead.contact_information}</TableCell>
                                    <TableCell>{lead.source}</TableCell>
                                    <TableCell>{lead.interest_level}</TableCell>
                                    <TableCell>{lead.status}</TableCell>
                                    <TableCell>{lead.salesperson}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Filter Dialog */}
                <Dialog open={!!openFilter} onClose={() => setOpenFilter(null)}>
                    <DialogTitle>Filter {openFilter}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Filter Value"
                            fullWidth
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenFilter(null)}>Cancel</Button>
                        <Button onClick={handleFilterApply}>Apply</Button>
                    </DialogActions>
                </Dialog>

                {/* Import Dialog */}
                <Dialog 
                    open={showImportDialog} 
                    onClose={() => {
                        setShowImportDialog(false);
                        setUploadError(null);
                    }}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Import CSV File</DialogTitle>
                    <DialogContent>
                        <Box
                            sx={{
                                border: '2px dashed',
                                borderColor: isDragging ? 'primary.main' : 'grey.300',
                                borderRadius: 2,
                                p: 3,
                                textAlign: 'center',
                                bgcolor: isDragging ? 'action.hover' : 'background.paper',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    bgcolor: 'action.hover',
                                },
                            }}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Drag and drop your CSV file here
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                or click to browse files
                            </Typography>
                            {uploadError && (
                                <Typography color="error" sx={{ mt: 2 }}>
                                    {uploadError}
                                </Typography>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setShowImportDialog(false);
                            setUploadError(null);
                        }}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}; 