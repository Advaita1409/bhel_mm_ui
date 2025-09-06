import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Chip,
    Box,
    Typography,
} from '@mui/material';
import { DateInput } from '@mantine/dates';
import { TextInput } from '@mantine/core';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ClearIcon from '@mui/icons-material/Clear';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import "../styles/PitoPo.css";

// Initialize dayjs with customParseFormat plugin
dayjs.extend(customParseFormat);

// Custom date parser for DateInput
const dateParser = (input) => {
    if (input.toLowerCase() === 'today') {
        return dayjs().format('YYYY-MM-DD');
    }
    if (input.toLowerCase() === 'tomorrow') {
        return dayjs().add(1, 'day').format('YYYY-MM-DD');
    }
    return dayjs(input, ['DD/MM/YYYY', 'YYYY-MM-DD']).isValid()
        ? dayjs(input, ['DD/MM/YYYY', 'YYYY-MM-DD']).format('YYYY-MM-DD')
        : null;
};

const PitoPo = () => {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);
    const [formData, setFormData] = useState({
        id: "",
        department: "",
        cust: "",
        project: "",
        itemType: "",
        contractType: "",
        priority: "",
        eofficeNumber: "",
        eofficeDate: null,
        prBy: "",
        prNumber: "",
        prDate: null,
        finalPrDate: null,
        itemName: "",
        prValue: "",
        numberOfItem: "",
        totalQuantity: "",
        uom: "",
        responsible1: "",
        responsible2: "",
        status: "",
        fileWith: "",
        remarks: "",
        rioDate: null,
        tenderType: "",
        platform: "",
        rfqDate: null,
        bidOpeningDate: null,
        technicalEval: null,
        commercialEval: null,
        priceBidOpening: null,
        raDate: null,
        negoDate: null,
        poProposalDate: null,
        poApprovalDate: null,
        gemPoNumber: "",
        gemPoDate: null,
        sapPoNumber: "",
        sapPoDate: null,
        poValue: "",
        saving: "",
    });

    const [filters, setFilters] = useState({
        department: null,
        cust: null,
        project: null,
        itemType: null,
        contractType: null,
        priority: null,
        prBy: null,
        responsible1: null,
        responsible2: null,
        status: null,
        platform: null,
        tenderType: null,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const uniqueValues = (key) =>
        [...new Set(tableData.map((row) => row[key] || null))]
            .filter(val => val !== null && val !== "")
            .sort()
            .map(val => ({ value: val, label: val }));

    const fetchTableData = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/purchase-monitor', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch data: ${response.status} ${errorText}`);
            }
            const data = await response.json();
            const mappedData = data.map(row => ({
                id: row.id || '',
                department: row.department || '',
                cust: row.cust || '',
                project: row.project || '',
                itemType: row.itemType || '',
                contractType: row.contractType || '',
                priority: row.priority || '',
                eofficeNumber: row.eofficeNumber || '',
                eofficeDate: row.eofficeDate || null,
                prBy: row.prBy || '',
                prNumber: row.prNumber || '',
                prDate: row.prDate || null,
                finalPrDate: row.finalPrDate || null,
                itemName: row.itemName || '',
                prValue: row.prValue || '',
                numberOfItem: row.numberOfItem || '',
                totalQuantity: row.totalQuantity || '',
                uom: row.uom || '',
                responsible1: row.responsible1 || '',
                responsible2: row.responsible2 || '',
                status: row.status || '',
                fileWith: row.fileWith || '',
                remarks: row.remarks || '',
                rioDate: row.rioDate || null,
                tenderType: row.tenderType || '',
                platform: row.platform || '',
                rfqDate: row.rfqDate || null,
                bidOpeningDate: row.bidOpeningDate || null,
                technicalEval: row.technicalEval || null,
                commercialEval: row.commercialEval || null,
                priceBidOpening: row.priceBidOpening || null,
                raDate: row.raDate || null,
                negoDate: row.negoDate || null,
                poProposalDate: row.poProposalDate || null,
                poApprovalDate: row.poApprovalDate || null,
                gemPoNumber: row.gemPoNumber || '',
                gemPoDate: row.gemPoDate || null,
                sapPoNumber: row.sapPoNumber || '',
                sapPoDate: row.sapPoDate || null,
                poValue: row.poValue || '',
                saving: row.saving || '',
            }));
            mappedData.sort((a, b) => {
                const idA = a.id.toString();
                const idB = b.id.toString();
                return idA.localeCompare(idB, undefined, { numeric: true });
            });
            setTableData(mappedData);
        } catch (error) {
            console.error('Error fetching table data:', error);
            setSnackbarMessage(`Error: ${error.message}`);
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTableData();
    }, []);

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value === 'all' ? null : value }));
        setCurrentPage(1);
    };

    const filteredData = tableData.filter((row) => {
        return Object.keys(filters).every((key) => {
            return !filters[key] || (row[key] && row[key].toString() === filters[key].toString());
        });
    });

    const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const totalPages = Math.ceil(filteredData.length / pageSize);

    const handleAddNew = () => {
        setEditingRowId(null);
        setFormData({
            id: "",
            department: "",
            cust: "",
            project: "",
            itemType: "",
            contractType: "",
            priority: "",
            eofficeNumber: "",
            eofficeDate: null,
            prBy: "",
            prNumber: "",
            prDate: null,
            finalPrDate: null,
            itemName: "",
            prValue: "",
            numberOfItem: "",
            totalQuantity: "",
            uom: "",
            responsible1: "",
            responsible2: "",
            status: "",
            fileWith: "",
            remarks: "",
            rioDate: null,
            tenderType: "",
            platform: "",
            rfqDate: null,
            bidOpeningDate: null,
            technicalEval: null,
            commercialEval: null,
            priceBidOpening: null,
            raDate: null,
            negoDate: null,
            poProposalDate: null,
            poApprovalDate: null,
            gemPoNumber: "",
            gemPoDate: null,
            sapPoNumber: "",
            sapPoDate: null,
            poValue: "",
            saving: "",
        });
        setDialogOpen(true);
    };

    const handleEdit = async (row) => {
        setEditingRowId(row.id);
        try {
            const response = await fetch(`http://localhost:8080/purchase-monitor/${row.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch row data: ${response.status} ${errorText}`);
            }
            const data = await response.json();
            setFormData({
                id: data.id || '',
                department: data.department || '',
                cust: data.cust || '',
                project: data.project || '',
                itemType: data.itemType || '',
                contractType: data.contractType || '',
                priority: data.priority || '',
                eofficeNumber: data.eofficeNumber || '',
                eofficeDate: data.eofficeDate || null,
                prBy: data.prBy || '',
                prNumber: data.prNumber || '',
                prDate: data.prDate || null,
                finalPrDate: data.finalPrDate || null,
                itemName: data.itemName || '',
                prValue: data.prValue || '',
                numberOfItem: data.numberOfItem || '',
                totalQuantity: data.totalQuantity || '',
                uom: data.uom || '',
                responsible1: data.responsible1 || '',
                responsible2: data.responsible2 || '',
                status: data.status || '',
                fileWith: data.fileWith || '',
                remarks: data.remarks || '',
                rioDate: data.rioDate || null,
                tenderType: data.tenderType || '',
                platform: data.platform || '',
                rfqDate: data.rfqDate || null,
                bidOpeningDate: data.bidOpeningDate || null,
                technicalEval: data.technicalEval || null,
                commercialEval: data.commercialEval || null,
                priceBidOpening: data.priceBidOpening || null,
                raDate: data.raDate || null,
                negoDate: data.negoDate || null,
                poProposalDate: data.poProposalDate || null,
                poApprovalDate: data.poApprovalDate || null,
                gemPoNumber: data.gemPoNumber || '',
                gemPoDate: data.gemPoDate || null,
                sapPoNumber: data.sapPoNumber || '',
                sapPoDate: data.sapPoDate || null,
                poValue: data.poValue || '',
                saving: data.saving || '',
            });
        } catch (error) {
            console.error('Error fetching row data:', error);
            setSnackbarMessage(`Error: ${error.message}`);
            setSnackbarOpen(true);
            setFormData({ ...row });
        }
        setDialogOpen(true);
    };

    const handleFormChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiData = {
            department: formData.department || null,
            cust: formData.cust || null,
            project: formData.project || null,
            itemType: formData.itemType || null,
            contractType: formData.contractType || null,
            priority: formData.priority || null,
            eofficeNumber: formData.eofficeNumber || null,
            eofficeDate: formData.eofficeDate || null,
            prBy: formData.prBy || null,
            prNumber: formData.prNumber || null,
            prDate: formData.prDate || null,
            finalPrDate: formData.finalPrDate || null,
            itemName: formData.itemName || null,
            prValue: formData.prValue ? parseFloat(formData.prValue) : null,
            numberOfItem: formData.numberOfItem ? parseInt(formData.numberOfItem) : null,
            totalQuantity: formData.totalQuantity ? parseInt(formData.totalQuantity) : null,
            uom: formData.uom || null,
            responsible1: formData.responsible1 || null,
            responsible2: formData.responsible2 || null,
            status: formData.status || null,
            fileWith: formData.fileWith || null,
            remarks: formData.remarks || null,
            rioDate: formData.rioDate || null,
            tenderType: formData.tenderType || null,
            platform: formData.platform || null,
            rfqDate: formData.rfqDate || null,
            bidOpeningDate: formData.bidOpeningDate || null,
            technicalEval: formData.technicalEval || null,
            commercialEval: formData.commercialEval || null,
            priceBidOpening: formData.priceBidOpening || null,
            raDate: formData.raDate || null,
            negoDate: formData.negoDate || null,
            poProposalDate: formData.poProposalDate || null,
            poApprovalDate: formData.poApprovalDate || null,
            gemPoNumber: formData.gemPoNumber || null,
            gemPoDate: formData.gemPoDate || null,
            sapPoNumber: formData.sapPoNumber || null,
            sapPoDate: formData.sapPoDate || null,
            poValue: formData.poValue ? parseFloat(formData.poValue) : null,
            saving: formData.saving ? parseFloat(formData.saving) : null,
        };

        try {
            if (!formData.department || !formData.itemName) {
                setSnackbarMessage('Department and Item Name are required.');
                setSnackbarOpen(true);
                return;
            }

            if (editingRowId) {
                const response = await fetch(`http://localhost:8080/purchase-monitor/${editingRowId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ id: editingRowId, ...apiData }),
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to update row: ${response.status} ${errorText}`);
                }
                setSnackbarMessage('Row updated successfully!');
            } else {
                const response = await fetch('http://localhost:8080/purchase-monitor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(apiData),
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to add new row: ${response.status} ${errorText}`);
                }
                setSnackbarMessage('Row added successfully!');
            }
            await fetchTableData();
            setDialogOpen(false);
            setEditingRowId(null);
            setFormData({
                id: "",
                department: "",
                cust: "",
                project: "",
                itemType: "",
                contractType: "",
                priority: "",
                eofficeNumber: "",
                eofficeDate: null,
                prBy: "",
                prNumber: "",
                prDate: null,
                finalPrDate: null,
                itemName: "",
                prValue: "",
                numberOfItem: "",
                totalQuantity: "",
                uom: "",
                responsible1: "",
                responsible2: "",
                status: "",
                fileWith: "",
                remarks: "",
                rioDate: null,
                tenderType: "",
                platform: "",
                rfqDate: null,
                bidOpeningDate: null,
                technicalEval: null,
                commercialEval: null,
                priceBidOpening: null,
                raDate: null,
                negoDate: null,
                poProposalDate: null,
                poApprovalDate: null,
                gemPoNumber: "",
                gemPoDate: null,
                sapPoNumber: "",
                sapPoDate: null,
                poValue: "",
                saving: "",
            });
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error submitting form:', error.message);
            setSnackbarMessage(`Error: ${error.message}`);
            setSnackbarOpen(true);
        }
    };

    const handleExport = () => {
        const exportData = filteredData.map(row => ({
            id: row.id || '-',
            department: row.department || '-',
            cust: row.cust || '-',
            project: row.project || '-',
            itemType: row.itemType || '-',
            contractType: row.contractType || '-',
            priority: row.priority || '-',
            eofficeNumber: row.eofficeNumber || '-',
            eofficeDate: row.eofficeDate || '-',
            prBy: row.prBy || '-',
            prNumber: row.prNumber || '-',
            prDate: row.prDate || '-',
            finalPrDate: row.finalPrDate || '-',
            itemName: row.itemName || '-',
            prValue: row.prValue || '-',
            numberOfItem: row.numberOfItem || '-',
            totalQuantity: row.totalQuantity || '-',
            uom: row.uom || '-',
            responsible1: row.responsible1 || '-',
            responsible2: row.responsible2 || '-',
            status: row.status || '-',
            fileWith: row.fileWith || '-',
            remarks: row.remarks || '-',
            rioDate: row.rioDate || '-',
            tenderType: row.tenderType || '-',
            platform: row.platform || '-',
            rfqDate: row.rfqDate || '-',
            bidOpeningDate: row.bidOpeningDate || '-',
            technicalEval: row.technicalEval || '-',
            commercialEval: row.commercialEval || '-',
            priceBidOpening: row.priceBidOpening || '-',
            raDate: row.raDate || '-',
            negoDate: row.negoDate || '-',
            poProposalDate: row.poProposalDate || '-',
            poApprovalDate: row.poApprovalDate || '-',
            gemPoNumber: row.gemPoNumber || '-',
            gemPoDate: row.gemPoDate || '-',
            sapPoNumber: row.sapPoNumber || '-',
            sapPoDate: row.sapPoDate || '-',
            poValue: row.poValue || '-',
            saving: row.saving || '-',
        }));
        const ws = XLSX.utils.json_to_sheet(exportData, {
            header: [
                'id', 'department', 'cust', 'project', 'itemType', 'contractType', 'priority',
                'eofficeNumber', 'eofficeDate', 'prBy', 'prNumber', 'prDate', 'finalPrDate',
                'itemName', 'prValue', 'numberOfItem', 'totalQuantity', 'uom', 'responsible1',
                'responsible2', 'status', 'fileWith', 'remarks', 'rioDate', 'tenderType',
                'platform', 'rfqDate', 'bidOpeningDate', 'technicalEval', 'commercialEval',
                'priceBidOpening', 'raDate', 'negoDate', 'poProposalDate', 'poApprovalDate',
                'gemPoNumber', 'gemPoDate', 'sapPoNumber', 'sapPoDate', 'poValue', 'saving'
            ]
        });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "PI to PO Data");
        XLSX.writeFile(wb, "pitopo_data.xlsx");
    };

    if (loading) return <Typography className="text-center text-lg text-gray-600">Loading data...</Typography>;

    const tooltipTexts = {
        actions: 'Modify the row',
        id: 'Serial Number',
        department: 'Department',
        cust: 'Customer',
        project: 'Project',
        itemType: 'Material Type',
        contractType: 'Contract Type',
        priority: 'Priority',
        eofficeNumber: 'eOffice Number',
        eofficeDate: 'eOffice Received Date',
        prBy: 'PR From',
        prNumber: 'PR Number',
        prDate: 'PR Date',
        finalPrDate: 'PR Accepted Date',
        itemName: 'Item Name',
        prValue: 'PR Value',
        numberOfItem: 'Number of Line Items',
        totalQuantity: 'Total Quantity',
        uom: 'UOM',
        responsible1: 'Responsible 1',
        responsible2: 'Responsible 2',
        status: 'Status',
        fileWith: 'eOffice File With',
        remarks: 'Remarks',
        rioDate: 'RIO Date',
        tenderType: 'Tender Type',
        platform: 'Tender Platform',
        rfqDate: 'RFQ Date',
        bidOpeningDate: 'Bid Opening Date',
        technicalEval: 'Technical Evaluation Date',
        commercialEval: 'Commercial Evaluation Date',
        priceBidOpening: 'Price Bid Opening Date',
        raDate: 'RA Date',
        negoDate: 'Negotiation Date',
        poProposalDate: 'PO Proposal Date',
        poApprovalDate: 'PO Approval Date',
        gemPoNumber: 'GEM PO Number',
        gemPoDate: 'GEM PO Date',
        sapPoNumber: 'SAP PO Number / ARC Reference',
        sapPoDate: 'SAP PO Date / ARC Date',
        poValue: 'PO Value / ARC Value',
        saving: 'Saving',
    };

    const headers = [
        { key: 'actions', label: 'Modify', width: 80, group: 'actions' },
        { key: 'id', label: 'SN', width: 250, group: 1 },
        { key: 'department', label: 'Dept', width: 250, group: 1 },
        { key: 'cust', label: 'Cust', width: 250, group: 1 },
        { key: 'project', label: 'Project', width: 250, group: 1 },
        { key: 'itemType', label: 'Mat Type', width: 250, group: 1 },
        { key: 'contractType', label: 'Contract Type', width: 250, group: 1 },
        { key: 'priority', label: 'Priority', width: 250, group: 1 },
        { key: 'eofficeNumber', label: 'eOffice No.', width: 250, group: 1 },
        { key: 'eofficeDate', label: 'eOffice Rcvd Date', width: 250, group: 1 },
        { key: 'prBy', label: 'PR From', width: 250, group: 1 },
        { key: 'prNumber', label: 'PR No', width: 250, group: 1 },
        { key: 'prDate', label: 'PR Dt', width: 250, group: 1 },
        { key: 'finalPrDate', label: 'PR Accepted Dt', width: 250, group: 1 },
        { key: 'itemName', label: 'Item Name', width: 250, group: 1 },
        { key: 'prValue', label: 'PR Value', width: 250, group: 1 },
        { key: 'numberOfItem', label: 'No of Line Item', width: 250, group: 1 },
        { key: 'totalQuantity', label: 'Total Qty', width: 250, group: 1 },
        { key: 'uom', label: 'UOM', width: 250, group: 1 },
        { key: 'responsible1', label: 'Responsible 1', width: 250, group: 1 },
        { key: 'responsible2', label: 'Responsible 2', width: 250, group: 1 },
        { key: 'status', label: 'Status', width: 250, group: 2 },
        { key: 'fileWith', label: 'eOffice File With', width: 250, group: 2 },
        { key: 'remarks', label: 'Remarks', width: 250, group: 2 },
        { key: 'rioDate', label: 'RIO Date', width: 250, group: 3 },
        { key: 'tenderType', label: 'Tender Type', width: 250, group: 3 },
        { key: 'platform', label: 'Tender Platform', width: 250, group: 3 },
        { key: 'rfqDate', label: 'RFQ Dt', width: 250, group: 3 },
        { key: 'bidOpeningDate', label: 'BOD', width: 250, group: 3 },
        { key: 'technicalEval', label: 'TE Dt', width: 250, group: 3 },
        { key: 'commercialEval', label: 'CE Dt', width: 250, group: 3 },
        { key: 'priceBidOpening', label: 'PBO Dt', width: 250, group: 3 },
        { key: 'raDate', label: 'RA Dt', width: 250, group: 3 },
        { key: 'negoDate', label: 'Nego Dt', width: 250, group: 3 },
        { key: 'poProposalDate', label: 'PO Proposal Dt', width: 250, group: 3 },
        { key: 'poApprovalDate', label: 'PP Approval Dt', width: 250, group: 4 },
        { key: 'gemPoNumber', label: 'GEM PO No', width: 250, group: 4 },
        { key: 'gemPoDate', label: 'GEM PO Dt', width: 250, group: 4 },
        { key: 'sapPoNumber', label: 'SAP PO No / ARC Reference', width: 250, group: 4 },
        { key: 'sapPoDate', label: 'SAP PO Dt / ARC Dt', width: 250, group: 4 },
        { key: 'poValue', label: 'PO Value / ARC Value', width: 250, group: 4 },
        { key: 'saving', label: 'Saving', width: 250, group: 5 },
    ];

    return (
        <div className="pitopo-container">
            <Typography variant="h6" className="pitopo-title">PI to PO Monitoring</Typography>

            <div className="filters-wrapper" style={{ padding: '10px' }}>
                <Grid container spacing={1.5}>
                    <Grid item xs={1.5}>
                        <Select
                            label="Department"
                            size="small"
                            value={filters.department || 'all'}
                            onChange={(e) => handleFilterChange("department", e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem value="all">All Depts</MenuItem>
                            {uniqueValues("department").map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={1.5}>
                        <Select
                            label="Customer"
                            size="small"
                            value={filters.cust || 'all'}
                            onChange={(e) => handleFilterChange("cust", e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem value="all">All Custs</MenuItem>
                            {uniqueValues("cust").map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={1.5}>
                        <Select
                            label="Project"
                            size="small"
                            value={filters.project || 'all'}
                            onChange={(e) => handleFilterChange("project", e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem value="all">All Projects</MenuItem>
                            {uniqueValues("project").map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={1.5}>
                        <Select
                            label="Item Type"
                            size="small"
                            value={filters.itemType || 'all'}
                            onChange={(e) => handleFilterChange("itemType", e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem value="all">All Types</MenuItem>
                            {uniqueValues("itemType").map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={1.5}>
                        <Select
                            label="Contract Type"
                            size="small"
                            value={filters.contractType || 'all'}
                            onChange={(e) => handleFilterChange("contractType", e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem value="all">All Contracts</MenuItem>
                            {uniqueValues("contractType").map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={1.5}>
                        <Select
                            label="Priority"
                            size="small"
                            value={filters.priority || 'all'}
                            onChange={(e) => handleFilterChange("priority", e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem value="all">All Priorities</MenuItem>
                            {uniqueValues("priority").map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={1.5}>
                        <Select
                            label="PR By"
                            size="small"
                            value={filters.prBy || 'all'}
                            onChange={(e) => handleFilterChange("prBy", e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem value="all">All PR By</MenuItem>
                            {uniqueValues("prBy").map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={1.5}>
                        <Select
                            label="Responsible 1"
                            size="small"
                            value={filters.responsible1 || 'all'}
                            onChange={(e) => handleFilterChange("responsible1", e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem value="all">All Resp 1</MenuItem>
                            {uniqueValues("responsible1").map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={1.5}>
                        <Select
                            label="Responsible 2"
                            size="small"
                            value={filters.responsible2 || 'all'}
                            onChange={(e) => handleFilterChange("responsible2", e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem value="all">All Resp 2</MenuItem>
                            {uniqueValues("responsible2").map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={1.5}>
                        <Select
                            label="Status"
                            size="small"
                            value={filters.status || 'all'}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem value="all">All Status</MenuItem>
                            {uniqueValues("status").map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={1.5}>
                        <Select
                            label="Platform"
                            size="small"
                            value={filters.platform || 'all'}
                            onChange={(e) => handleFilterChange("platform", e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem value="all">All Platforms</MenuItem>
                            {uniqueValues("platform").map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={1.5}>
                        <Select
                            label="Tender Type"
                            size="small"
                            value={filters.tenderType || 'all'}
                            onChange={(e) => handleFilterChange("tenderType", e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem value="all">All Tender Types</MenuItem>
                            {uniqueValues("tenderType").map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={1.5}>
                        <Button
                            onClick={handleAddNew}
                            className="action-btn add-new"
                            variant="contained"
                            size="small"
                            fullWidth
                            startIcon={<AddIcon />}
                        >
                            Add New Entry
                        </Button>
                    </Grid>
                    <Grid item xs={1.5}>
                        <Button
                            onClick={handleExport}
                            className="action-btn export"
                            variant="contained"
                            size="small"
                            fullWidth
                            startIcon={<FileDownloadIcon />}
                        >
                            Export to Excel
                        </Button>
                    </Grid>
                    <Grid item xs={1.5}>
                        <Button
                            onClick={() => setFilters({
                                department: null,
                                cust: null,
                                project: null,
                                itemType: null,
                                contractType: null,
                                priority: null,
                                prBy: null,
                                responsible1: null,
                                responsible2: null,
                                status: null,
                                platform: null,
                                tenderType: null,
                            })}
                            className="action-btn clear-filters"
                            variant="outlined"
                            size="small"
                            fullWidth
                            startIcon={<ClearIcon />}
                        >
                            Clear Filters
                        </Button>
                    </Grid>
                </Grid>
            </div>

            <TableContainer component={Paper} className="table-container">
                <Table sx={{ minWidth: '100%' }}>
                    <TableHead>
                        <TableRow>
                            {headers.map((header) => (
                                <TableCell
                                    key={header.key}
                                    sx={{
                                        width: header.width,
                                        backgroundColor:
                                            header.group === 1 ? '#E3F2FD' :
                                                header.group === 2 ? '#E8F5E9' :
                                                    header.group === 3 ? '#FFFDE7' :
                                                        header.group === 4 ? '#F3E5F5' :
                                                            header.group === 5 ? '#FFF3E0' :
                                                                header.group === 'actions' ? '#F5F5F5' : '#F5F5F5',
                                        fontWeight: '600',
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 1,
                                        border: '1px solid #D1D5DB',
                                    }}
                                    className="table-header"
                                    data-group={header.group}
                                >
                                    <Tooltip title={tooltipTexts[header.key] || header.label}>
                                        <Typography variant="body2">{header.label}</Typography>
                                    </Tooltip>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <TableRow
                                key={row.id}
                                className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}
                                sx={{ border: '1px solid #D1D5DB' }}
                            >
                                {headers.map((header) => (
                                    <TableCell
                                        key={header.key}
                                        sx={{
                                            backgroundColor:
                                                header.group === 1 ? '#E3F2FD' :
                                                    header.group === 2 ? '#E8F5E9' :
                                                        header.group === 3 ? '#FFFDE7' :
                                                            header.group === 4 ? '#F3E5F5' :
                                                                header.group === 5 ? '#FFF3E0' :
                                                                    'inherit',
                                            border: '1px solid #D1D5DB',
                                        }}
                                        data-group={header.group}
                                    >
                                        {header.key === 'actions' ? (
                                            <IconButton onClick={() => handleEdit(row)} color="primary">
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        ) : header.key === 'status' ? (
                                            <Chip
                                                label={row.status}
                                                color={
                                                    row.status?.toLowerCase() === 'open' ? 'error' :
                                                        row.status?.toLowerCase() === 'in progress' ? 'warning' :
                                                            row.status?.toLowerCase() === 'closed' ? 'success' : 'default'
                                                }
                                                size="small"
                                            />
                                        ) : (
                                            row[header.key]
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, page) => setCurrentPage(page)}
                    showFirstButton
                    showLastButton
                />
            </Box>

            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>{editingRowId ? 'Edit Row' : 'Add New Row'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ padding: '16px' }}>
                        <form onSubmit={handleSubmit}>
                            {/* User Department Information Section */}
                            <Box className="form-section">
                                <Typography variant="h6" className="form-section-title bg-blue-100">
                                    User Department Information
                                </Typography>
                                <Grid container spacing={1.5}>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="ID"
                                            description="Unique identifier"
                                            placeholder="Enter ID"
                                            value={formData.id}
                                            onChange={(e) => handleFormChange('id', e.target.value)}
                                            disabled
                                            withAsterisk
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="Priority"
                                            description="Priority level"
                                            placeholder="Enter Priority"
                                            value={formData.priority}
                                            onChange={(e) => handleFormChange('priority', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="Department"
                                            description="Department name"
                                            placeholder="Enter Department"
                                            value={formData.department}
                                            onChange={(e) => handleFormChange('department', e.target.value)}
                                            withAsterisk
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="Customer"
                                            description="Customer name"
                                            placeholder="Enter Customer"
                                            value={formData.cust}
                                            onChange={(e) => handleFormChange('cust', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="Project"
                                            description="Project name"
                                            placeholder="Enter Project"
                                            value={formData.project}
                                            onChange={(e) => handleFormChange('project', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="Material Type"
                                            description="Type of material"
                                            placeholder="Enter Material Type"
                                            value={formData.itemType}
                                            onChange={(e) => handleFormChange('itemType', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="Contract Type"
                                            description="Type of contract"
                                            placeholder="Enter Contract Type"
                                            value={formData.contractType}
                                            onChange={(e) => handleFormChange('contractType', e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* PR Information Section */}
                            <Box className="form-section">
                                <Typography variant="h6" className="form-section-title bg-green-100">
                                    PR Information
                                </Typography>
                                <Grid container spacing={1.5}>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="eOffice Number"
                                            description="eOffice reference number"
                                            placeholder="Enter eOffice Number"
                                            value={formData.eofficeNumber}
                                            onChange={(e) => handleFormChange('eofficeNumber', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <DateInput
                                            variant="filled"
                                            radius="xl"
                                            label="eOffice Received Date"
                                            description="Date eOffice was received"
                                            placeholder="Enter date or 'today'"
                                            value={formData.eofficeDate}
                                            onChange={(value) => handleFormChange('eofficeDate', value ? dayjs(value).format('YYYY-MM-DD') : null)}
                                            valueFormat="YYYY-MM-DD"
                                            dateParser={dateParser}
                                            clearable
                                            minDate={dayjs().toDate()}
                                            maxDate={dayjs().add(1, 'year').toDate()}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="PR From"
                                            description="Source of PR"
                                            placeholder="Enter PR From"
                                            value={formData.prBy}
                                            onChange={(e) => handleFormChange('prBy', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="PR Number"
                                            description="Purchase Requisition number"
                                            placeholder="Enter PR Number"
                                            value={formData.prNumber}
                                            onChange={(e) => handleFormChange('prNumber', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <DateInput
                                            variant="filled"
                                            radius="xl"
                                            label="PR Date"
                                            description="Date of PR issuance"
                                            placeholder="Enter date or 'today'"
                                            value={formData.prDate}
                                            onChange={(value) => handleFormChange('prDate', value ? dayjs(value).format('YYYY-MM-DD') : null)}
                                            valueFormat="YYYY-MM-DD"
                                            dateParser={dateParser}
                                            clearable
                                            minDate={dayjs().toDate()}
                                            maxDate={dayjs().add(1, 'year').toDate()}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <DateInput
                                            variant="filled"
                                            radius="xl"
                                            label="PR Accepted Date"
                                            description="Date PR was accepted"
                                            placeholder="Enter date or 'today'"
                                            value={formData.finalPrDate}
                                            onChange={(value) => handleFormChange('finalPrDate', value ? dayjs(value).format('YYYY-MM-DD') : null)}
                                            valueFormat="YYYY-MM-DD"
                                            dateParser={dateParser}
                                            clearable
                                            minDate={dayjs().toDate()}
                                            maxDate={dayjs().add(1, 'year').toDate()}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="Item Name"
                                            description="Name of the item"
                                            placeholder="Enter Item Name"
                                            value={formData.itemName}
                                            onChange={(e) => handleFormChange('itemName', e.target.value)}
                                            withAsterisk
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="PR Value"
                                            description="Value of PR"
                                            placeholder="Enter PR Value"
                                            value={formData.prValue}
                                            onChange={(e) => handleFormChange('prValue', e.target.value)}
                                            type="number"
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="No of Line Item"
                                            description="Number of line items"
                                            placeholder="Enter No of Line Item"
                                            value={formData.numberOfItem}
                                            onChange={(e) => handleFormChange('numberOfItem', e.target.value)}
                                            type="number"
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="Total Quantity"
                                            description="Total quantity required"
                                            placeholder="Enter Total Quantity"
                                            value={formData.totalQuantity}
                                            onChange={(e) => handleFormChange('totalQuantity', e.target.value)}
                                            type="number"
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="UOM"
                                            description="Unit of measure"
                                            placeholder="Enter UOM"
                                            value={formData.uom}
                                            onChange={(e) => handleFormChange('uom', e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* MM Section */}
                            <Box className="form-section">
                                <Typography variant="h6" className="form-section-title bg-yellow-100">
                                    MM
                                </Typography>
                                <Grid container spacing={1.5}>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="Responsible 1"
                                            description="Primary responsible person"
                                            placeholder="Enter Responsible 1"
                                            value={formData.responsible1}
                                            onChange={(e) => handleFormChange('responsible1', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="Responsible 2"
                                            description="Secondary responsible person"
                                            placeholder="Enter Responsible 2"
                                            value={formData.responsible2}
                                            onChange={(e) => handleFormChange('responsible2', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="Remarks"
                                            description="Additional comments"
                                            placeholder="Enter Remarks"
                                            value={formData.remarks}
                                            onChange={(e) => handleFormChange('remarks', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="Status"
                                            description="Current status"
                                            placeholder="Enter Status"
                                            value={formData.status}
                                            onChange={(e) => handleFormChange('status', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="eOffice File With"
                                            description="Person handling eOffice file"
                                            placeholder="Enter eOffice File With"
                                            value={formData.fileWith}
                                            onChange={(e) => handleFormChange('fileWith', e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Tender Information Section */}
                            <Box className="form-section">
                                <Typography variant="h6" className="form-section-title bg-purple-100">
                                    Tender Information
                                </Typography>
                                <Grid container spacing={1.5}>
                                    <Grid item xs={3}>
                                        <DateInput
                                            variant="filled"
                                            radius="xl"
                                            label="RIO Date"
                                            description="Request for Information date"
                                            placeholder="Enter date or 'today'"
                                            value={formData.rioDate}
                                            onChange={(value) => handleFormChange('rioDate', value ? dayjs(value).format('YYYY-MM-DD') : null)}
                                            valueFormat="YYYY-MM-DD"
                                            dateParser={dateParser}
                                            clearable
                                            minDate={dayjs().toDate()}
                                            maxDate={dayjs().add(1, 'year').toDate()}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="Tender Type"
                                            description="Type of tender"
                                            placeholder="Enter Tender Type"
                                            value={formData.tenderType}
                                            onChange={(e) => handleFormChange('tenderType', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="Tender Platform"
                                            description="Platform used for tender"
                                            placeholder="Enter Tender Platform"
                                            value={formData.platform}
                                            onChange={(e) => handleFormChange('platform', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <DateInput
                                            variant="filled"
                                            radius="xl"
                                            label="RFQ Date"
                                            description="Request for Quotation date"
                                            placeholder="Enter date or 'today'"
                                            value={formData.rfqDate}
                                            onChange={(value) => handleFormChange('rfqDate', value ? dayjs(value).format('YYYY-MM-DD') : null)}
                                            valueFormat="YYYY-MM-DD"
                                            dateParser={dateParser}
                                            clearable
                                            minDate={dayjs().toDate()}
                                            maxDate={dayjs().add(1, 'year').toDate()}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <DateInput
                                            variant="filled"
                                            radius="xl"
                                            label="Bid Opening Date"
                                            description="Date of bid opening"
                                            placeholder="Enter date or 'today'"
                                            value={formData.bidOpeningDate}
                                            onChange={(value) => handleFormChange('bidOpeningDate', value ? dayjs(value).format('YYYY-MM-DD') : null)}
                                            valueFormat="YYYY-MM-DD"
                                            dateParser={dateParser}
                                            clearable
                                            minDate={dayjs().toDate()}
                                            maxDate={dayjs().add(1, 'year').toDate()}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <DateInput
                                            variant="filled"
                                            radius="xl"
                                            label="Technical Eval Date"
                                            description="Technical evaluation date"
                                            placeholder="Enter date or 'today'"
                                            value={formData.technicalEval}
                                            onChange={(value) => handleFormChange('technicalEval', value ? dayjs(value).format('YYYY-MM-DD') : null)}
                                            valueFormat="YYYY-MM-DD"
                                            dateParser={dateParser}
                                            clearable
                                            minDate={dayjs().toDate()}
                                            maxDate={dayjs().add(1, 'year').toDate()}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <DateInput
                                            variant="filled"
                                            radius="xl"
                                            label="Commercial Eval Date"
                                            description="Commercial evaluation date"
                                            placeholder="Enter date or 'today'"
                                            value={formData.commercialEval}
                                            onChange={(value) => handleFormChange('commercialEval', value ? dayjs(value).format('YYYY-MM-DD') : null)}
                                            valueFormat="YYYY-MM-DD"
                                            dateParser={dateParser}
                                            clearable
                                            minDate={dayjs().toDate()}
                                            maxDate={dayjs().add(1, 'year').toDate()}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <DateInput
                                            variant="filled"
                                            radius="xl"
                                            label="Price Bid Opening"
                                            description="Price bid opening date"
                                            placeholder="Enter date or 'today'"
                                            value={formData.priceBidOpening}
                                            onChange={(value) => handleFormChange('priceBidOpening', value ? dayjs(value).format('YYYY-MM-DD') : null)}
                                            valueFormat="YYYY-MM-DD"
                                            dateParser={dateParser}
                                            clearable
                                            minDate={dayjs().toDate()}
                                            maxDate={dayjs().add(1, 'year').toDate()}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <DateInput
                                            variant="filled"
                                            radius="xl"
                                            label="RA Date"
                                            description="Reverse Auction date"
                                            placeholder="Enter date or 'today'"
                                            value={formData.raDate}
                                            onChange={(value) => handleFormChange('raDate', value ? dayjs(value).format('YYYY-MM-DD') : null)}
                                            valueFormat="YYYY-MM-DD"
                                            dateParser={dateParser}
                                            clearable
                                            minDate={dayjs().toDate()}
                                            maxDate={dayjs().add(1, 'year').toDate()}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <DateInput
                                            variant="filled"
                                            radius="xl"
                                            label="Negotiation Date"
                                            description="Negotiation date"
                                            placeholder="Enter date or 'today'"
                                            value={formData.negoDate}
                                            onChange={(value) => handleFormChange('negoDate', value ? dayjs(value).format('YYYY-MM-DD') : null)}
                                            valueFormat="YYYY-MM-DD"
                                            dateParser={dateParser}
                                            clearable
                                            minDate={dayjs().toDate()}
                                            maxDate={dayjs().add(1, 'year').toDate()}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* PO Information Section */}
                            <Box className="form-section">
                                <Typography variant="h6" className="form-section-title bg-orange-100">
                                    PO Information
                                </Typography>
                                <Grid container spacing={1.5}>
                                    <Grid item xs={3}>
                                        <DateInput
                                            variant="filled"
                                            radius="xl"
                                            label="PO Proposal Date"
                                            description="Date of PO proposal"
                                            placeholder="Enter date or 'today'"
                                            value={formData.poProposalDate}
                                            onChange={(value) => handleFormChange('poProposalDate', value ? dayjs(value).format('YYYY-MM-DD') : null)}
                                            valueFormat="YYYY-MM-DD"
                                            dateParser={dateParser}
                                            clearable
                                            minDate={dayjs().toDate()}
                                            maxDate={dayjs().add(1, 'year').toDate()}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <DateInput
                                            variant="filled"
                                            radius="xl"
                                            label="PO Approval Date"
                                            description="Date of PO approval"
                                            placeholder="Enter date or 'today'"
                                            value={formData.poApprovalDate}
                                            onChange={(value) => handleFormChange('poApprovalDate', value ? dayjs(value).format('YYYY-MM-DD') : null)}
                                            valueFormat="YYYY-MM-DD"
                                            dateParser={dateParser}
                                            clearable
                                            minDate={dayjs().toDate()}
                                            maxDate={dayjs().add(1, 'year').toDate()}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="GEM PO Number"
                                            description="GEM Purchase Order number"
                                            placeholder="Enter GEM PO Number"
                                            value={formData.gemPoNumber}
                                            onChange={(e) => handleFormChange('gemPoNumber', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <DateInput
                                            variant="filled"
                                            radius="xl"
                                            label="GEM PO Date"
                                            description="Date of GEM PO"
                                            placeholder="Enter date or 'today'"
                                            value={formData.gemPoDate}
                                            onChange={(value) => handleFormChange('gemPoDate', value ? dayjs(value).format('YYYY-MM-DD') : null)}
                                            valueFormat="YYYY-MM-DD"
                                            dateParser={dateParser}
                                            clearable
                                            minDate={dayjs().toDate()}
                                            maxDate={dayjs().add(1, 'year').toDate()}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="SAP PO No / ARC Ref"
                                            description="SAP PO or ARC reference"
                                            placeholder="Enter SAP PO Number"
                                            value={formData.sapPoNumber}
                                            onChange={(e) => handleFormChange('sapPoNumber', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <DateInput
                                            variant="filled"
                                            radius="xl"
                                            label="SAP PO Dt / ARC Dt"
                                            description="Date of SAP PO or ARC"
                                            placeholder="Enter date or 'today'"
                                            value={formData.sapPoDate}
                                            onChange={(value) => handleFormChange('sapPoDate', value ? dayjs(value).format('YYYY-MM-DD') : null)}
                                            valueFormat="YYYY-MM-DD"
                                            dateParser={dateParser}
                                            clearable
                                            minDate={dayjs().toDate()}
                                            maxDate={dayjs().add(1, 'year').toDate()}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="PO Value / ARC Value"
                                            description="Value of PO or ARC"
                                            placeholder="Enter PO Value"
                                            value={formData.poValue}
                                            onChange={(e) => handleFormChange('poValue', e.target.value)}
                                            type="number"
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextInput
                                            variant="filled"
                                            radius="xl"
                                            label="Saving"
                                            description="Savings achieved"
                                            placeholder="Enter Saving"
                                            value={formData.saving}
                                            onChange={(e) => handleFormChange('saving', e.target.value)}
                                            type="number"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </form>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} variant="outlined" size="small">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" size="small">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            />
        </div>
    );
};

export default PitoPo;