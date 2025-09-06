import React, { useState, useEffect, useMemo } from "react";
import * as XLSX from 'xlsx';
import {
    Button, Dialog, DialogActions, DialogTitle, DialogContent,
    Grid, IconButton, MenuItem, Pagination, Paper, Select,
    Snackbar, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Tooltip, Chip, Box, Typography, TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ClearIcon from '@mui/icons-material/Clear';
import InfoIcon from '@mui/icons-material/Info';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import "../styles/PitoPo.css";

// Initialize dayjs with customParseFormat plugin
dayjs.extend(customParseFormat);

// Predefined options for dropdowns
const departmentOptions = [
    { value: 'IP', label: 'Porcelains Insulator Production' },
    { value: 'CI', label: 'Composite Insulator' },
    { value: 'AC', label: 'Advance Ceramics' },
    { value: 'NP', label: 'New Products' },
    { value: 'PT', label: 'Pouring Tube' },
    { value: 'SCR', label: 'Selective Catalytic Reaction' },
    { value: 'M&S', label: 'Maintenance & Services' },
    { value: 'DTG', label: 'Digital Transformation Group' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'PR', label: 'Public Relations' },
    { value: 'MKTG', label: 'Marketing' },
    { value: 'Comm', label: 'Commercial' },
];

const itemTypeOptions = [
    { value: 'DM', label: 'Direct Materials' },
    { value: 'IDM', label: 'In-Direct Material' },
    { value: 'CA', label: 'Capital Item' },
    { value: 'CIV', label: 'Civil Item' },
];

const contractTypeOptions = [
    { value: 'ARC', label: 'Annual Rate Contract' },
    { value: 'OT', label: 'One Time Procurement' },
];

const priorityOptions = [
    { value: 'High', label: 'High (Impacts current/next month or delayed)' },
    { value: 'Med', label: 'Medium (Required after 90 days)' },
    { value: 'Low', label: 'Low (Required after 120 days)' },
];

const responsibleOptions = [
    { value: 'MK', label: 'Manoj K' },
    { value: 'AS', label: 'Anita Sinha' },
    { value: 'NK', label: 'Niraj Kumar' },
    { value: 'PKN', label: 'P K Nagraj' },
    { value: 'YS', label: 'Yogesh Sharma' },
    { value: 'VK', label: 'Vinay Kumar' },
];

const responsible2Options = [
    ...responsibleOptions,
    { value: 'APS', label: 'Apoorva Shukla' },
    { value: 'PL', label: 'Palani' },
    { value: 'AV', label: 'Ankur Verma' },
    { value: 'RKM', label: 'Ramendra Kumar Mach' },
    { value: 'LX', label: 'Laxmi' },
    { value: 'PKP', label: 'Pradip Kumar Pandit' },
    { value: 'AK', label: 'Amit Kumar' },
    { value: 'SS', label: 'Shashi Sharma' },
    { value: 'Others', label: 'Others' },
];

const tenderTypeOptions = [
    { value: 'OT', label: 'Open Tender' },
    { value: 'LT', label: 'Limited Tender' },
    { value: 'ST', label: 'Single Tender' },
    { value: 'DO', label: 'Direct Order' },
    { value: 'IUT', label: 'Inter Unit Tender' },
    { value: 'Email', label: 'Email' },
    { value: 'PE', label: 'Personal Enquiry' },
    { value: 'U-ARC', label: 'Unit Annual Rate Contract' },
    { value: 'C-ARC', label: 'Corporate Annual Rate Contract' },
];

const platformOptions = [
    { value: 'GeM', label: 'GeM' },
    { value: 'NIC', label: 'NIC' },
    { value: 'Email', label: 'Email' },
];

const uomOptions = [
    { value: 'Nos', label: 'Nos' },
    { value: 'MT', label: 'MT' },
    { value: 'Kg', label: 'Kg' },
    { value: 'L', label: 'L' },
    { value: 'm', label: 'm' },
];

const statusOptions = [
    { value: 'Open', label: 'Open' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Closed', label: 'Closed' },
];

// Custom Hook for computing unique values
const useUniqueValues = (tableData, key) => {
    return useMemo(() => {
        return [...new Set(tableData.map((row) => row[key] || null))]
            .filter(val => val !== null && val !== "")
            .sort()
            .map(val => ({ value: val, label: val }));
    }, [tableData, key]);
};

// Reusable DatePicker Component using MUI
const CustomDatePicker = ({ fieldName, label, description, formData, handleFormChange, editingRowId }) => (
    <Grid item xs={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label={label}
                value={formData[fieldName] ? dayjs(formData[fieldName]) : null}
                onChange={(newValue) => handleFormChange(fieldName, newValue ? dayjs(newValue).format('YYYY-MM-DD') : '')}
                format="YYYY-MM-DD"
                minDate={editingRowId ? dayjs().subtract(5, 'year') : dayjs()}
                maxDate={dayjs().add(1, 'year')}
                slotProps={{
                    textField: {
                        variant: 'filled',
                        helperText: description,
                        fullWidth: true,
                        size: 'small',
                    },
                }}
            />
        </LocalizationProvider>
    </Grid>
);

// Date fields configuration
const dateFields = [
    { key: 'eofficeDate', label: 'eOffice Received Date', description: 'Select or type a date', section: 'User Department Information' },
    { key: 'prDate', label: 'PR Date', description: 'Select or type a PR date', section: 'PR Information' },
    { key: 'finalPrDate', label: 'PR Accepted Date', description: 'Select or type a PR accepted date', section: 'PR Information' },
    { key: 'rioDate', label: 'RIO Date', description: 'Select or type a RIO date', section: 'Tender Information' },
    { key: 'rfqDate', label: 'RFQ Date', description: 'Select or type a RFQ date', section: 'Tender Information' },
    { key: 'bidOpeningDate', label: 'Bid Opening Date', description: 'Select or type a bid opening date', section: 'Tender Information' },
    { key: 'technicalEval', label: 'Technical Eval Date', description: 'Select or type a technical evaluation date', section: 'Tender Information' },
    { key: 'commercialEval', label: 'Commercial Eval Date', description: 'Select or type a commercial evaluation date', section: 'Tender Information' },
    { key: 'priceBidOpening', label: 'Price Bid Opening Date', description: 'Select or type a price bid opening date', section: 'Tender Information' },
    { key: 'raDate', label: 'RA Date', description: 'Select or type a reverse auction date', section: 'Tender Information' },
    { key: 'negoDate', label: 'Negotiation Date', description: 'Select or type a negotiation date', section: 'Tender Information' },
    { key: 'poProposalDate', label: 'PO Proposal Date', description: 'Select or type a PO proposal date', section: 'PO Information' },
    { key: 'poApprovalDate', label: 'PO Approval Date', description: 'Select or type a PO approval date', section: 'PO Information' },
    { key: 'gemPoDate', label: 'GEM PO Date', description: 'Select or type a GEM PO date', section: 'PO Information' },
    { key: 'sapPoDate', label: 'SAP PO Date / ARC Date', description: 'Select or type a SAP PO or ARC date', section: 'PO Information' },
];

const PitoPo = () => {
    // State declarations
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        id: "", department: "", cust: "", project: "", itemType: "", contractType: "", priority: "",
        eofficeNumber: "", eofficeDate: "", prBy: "", prNumber: "", prDate: "", finalPrDate: "",
        itemName: "", prValue: "", numberOfItem: "", totalQuantity: "", uom: "",
        responsible1: "", responsible2: "", status: "", fileWith: "", fileWithComment: "", remarks: "",
        rioDate: "", tenderType: "", platform: "", rfqDate: "", bidOpeningDate: "",
        technicalEval: "", commercialEval: "", priceBidOpening: "", raDate: "", negoDate: "",
        poProposalDate: "", poApprovalDate: "", gemPoNumber: "", gemPoDate: "",
        sapPoNumber: "", sapPoDate: "", poValue: "", saving: "",
    });
    const [filters, setFilters] = useState({
        department: null, cust: null, project: null, itemType: null, contractType: null,
        priority: null, prBy: null, responsible1: null, responsible2: null, status: null,
        platform: null, tenderType: null,
    });
    const [currentPage, setCurrentPage] = useState(1);

    // Constants
    const pageSize = 10;

    // Use custom Hook for dynamic dropdown options
    const custOptions = useUniqueValues(tableData, 'cust');
    const projectOptions = useUniqueValues(tableData, 'project');
    const prByOptions = useUniqueValues(tableData, 'prBy');

    // Fetch table data
    const fetchTableData = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/purchase-monitor', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
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
                eofficeDate: row.eofficeDate || '',
                prBy: row.prBy || '',
                prNumber: row.prNumber || '',
                prDate: row.prDate || '',
                finalPrDate: row.finalPrDate || '',
                itemName: row.itemName || '',
                prValue: row.prValue || '',
                numberOfItem: row.numberOfItem || '',
                totalQuantity: row.totalQuantity || '',
                uom: row.uom || '',
                responsible1: row.responsible1 || '',
                responsible2: row.responsible2 || '',
                status: row.status || '',
                fileWith: row.fileWith || '',
                fileWithComment: row.fileWithComment || '',
                remarks: row.remarks || '',
                rioDate: row.rioDate || '',
                tenderType: row.tenderType || '',
                platform: row.platform || '',
                rfqDate: row.rfqDate || '',
                bidOpeningDate: row.bidOpeningDate || '',
                technicalEval: row.technicalEval || '',
                commercialEval: row.commercialEval || '',
                priceBidOpening: row.priceBidOpening || '',
                raDate: row.raDate || '',
                negoDate: row.negoDate || '',
                poProposalDate: row.poProposalDate || '',
                poApprovalDate: row.poApprovalDate || '',
                gemPoNumber: row.gemPoNumber || '',
                gemPoDate: row.gemPoDate || '',
                sapPoNumber: row.sapPoNumber || '',
                sapPoDate: row.sapPoDate || '',
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
            id: "", department: "", cust: "", project: "", itemType: "", contractType: "", priority: "",
            eofficeNumber: "", eofficeDate: "", prBy: "", prNumber: "", prDate: "", finalPrDate: "",
            itemName: "", prValue: "", numberOfItem: "", totalQuantity: "", uom: "",
            responsible1: "", responsible2: "", status: "", fileWith: "", fileWithComment: "", remarks: "",
            rioDate: "", tenderType: "", platform: "", rfqDate: "", bidOpeningDate: "",
            technicalEval: "", commercialEval: "", priceBidOpening: "", raDate: "", negoDate: "",
            poProposalDate: "", poApprovalDate: "", gemPoNumber: "", gemPoDate: "",
            sapPoNumber: "", sapPoDate: "", poValue: "", saving: "",
        });
        setDialogOpen(true);
    };

    const handleEdit = async (row) => {
        setEditingRowId(row.id);
        try {
            const response = await fetch(`http://localhost:8080/purchase-monitor/${row.id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
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
                eofficeDate: data.eofficeDate || '',
                prBy: data.prBy || '',
                prNumber: data.prNumber || '',
                prDate: data.prDate || '',
                finalPrDate: data.finalPrDate || '',
                itemName: data.itemName || '',
                prValue: data.prValue || '',
                numberOfItem: data.numberOfItem || '',
                totalQuantity: data.totalQuantity || '',
                uom: data.uom || '',
                responsible1: data.responsible1 || '',
                responsible2: data.responsible2 || '',
                status: data.status || '',
                fileWith: data.fileWith || '',
                fileWithComment: data.fileWithComment || '',
                remarks: data.remarks || '',
                rioDate: data.rioDate || '',
                tenderType: data.tenderType || '',
                platform: data.platform || '',
                rfqDate: data.rfqDate || '',
                bidOpeningDate: data.bidOpeningDate || '',
                technicalEval: data.technicalEval || '',
                commercialEval: data.commercialEval || '',
                priceBidOpening: data.priceBidOpening || '',
                raDate: data.raDate || '',
                negoDate: data.negoDate || '',
                poProposalDate: data.poProposalDate || '',
                poApprovalDate: data.poApprovalDate || '',
                gemPoNumber: data.gemPoNumber || '',
                gemPoDate: data.gemPoDate || '',
                sapPoNumber: data.sapPoNumber || '',
                sapPoDate: data.sapPoDate || '',
                poValue: data.poValue || '',
                saving: data.saving || '',
            });
        } catch (error) {
            console.error('Error fetching row data:', error);
            setSnackbarMessage(`Error: ${error.message}`);
            setSnackbarOpen(true);
            setFormData({ ...row, fileWithComment: row.fileWithComment || '' });
        }
        setDialogOpen(true);
    };

    const handleFormChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Validation
        if (!formData.department || !formData.itemName || !formData.itemType || !formData.priority) {
            setSnackbarMessage('Department, Item Name, Item Type, and Priority are required.');
            setSnackbarOpen(true);
            setSubmitting(false);
            return;
        }
        if (formData.priority === 'High' && !formData.fileWithComment) {
            setSnackbarMessage('File With Comment is required for High priority.');
            setSnackbarOpen(true);
            setSubmitting(false);
            return;
        }
        if (!/^[A-Z]$|^Other:\d+$/.test(formData.prValue)) {
            setSnackbarMessage('PR Value must be a letter (A-Z) or "Other:<number>"');
            setSnackbarOpen(true);
            setSubmitting(false);
            return;
        }

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
            prValue: formData.prValue || null,
            numberOfItem: formData.numberOfItem ? parseInt(formData.numberOfItem) : null,
            totalQuantity: formData.totalQuantity || null,
            uom: formData.uom || null,
            responsible1: formData.responsible1 || null,
            responsible2: formData.responsible2 || null,
            status: formData.status || null,
            fileWith: formData.fileWith || null,
            fileWithComment: formData.priority === 'High' ? formData.fileWithComment || null : null,
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
            if (editingRowId) {
                const response = await fetch(`http://localhost:8080/purchase-monitor/${editingRowId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
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
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
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
                id: "", department: "", cust: "", project: "", itemType: "", contractType: "", priority: "",
                eofficeNumber: "", eofficeDate: "", prBy: "", prNumber: "", prDate: "", finalPrDate: "",
                itemName: "", prValue: "", numberOfItem: "", totalQuantity: "", uom: "",
                responsible1: "", responsible2: "", status: "", fileWith: "", fileWithComment: "", remarks: "",
                rioDate: "", tenderType: "", platform: "", rfqDate: "", bidOpeningDate: "",
                technicalEval: "", commercialEval: "", priceBidOpening: "", raDate: "", negoDate: "",
                poProposalDate: "", poApprovalDate: "", gemPoNumber: "", gemPoDate: "",
                sapPoNumber: "", sapPoDate: "", poValue: "", saving: "",
            });
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error submitting form:', error.message);
            setSnackbarMessage(`Error: ${error.message}`);
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
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
            fileWithComment: row.fileWithComment || '-',
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
                'responsible2', 'status', 'fileWith', 'fileWithComment', 'remarks', 'rioDate',
                'tenderType', 'platform', 'rfqDate', 'bidOpeningDate', 'technicalEval',
                'commercialEval', 'priceBidOpening', 'raDate', 'negoDate', 'poProposalDate',
                'poApprovalDate', 'gemPoNumber', 'gemPoDate', 'sapPoNumber', 'sapPoDate',
                'poValue', 'saving'
            ]
        });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "PI to PO Data");
        XLSX.writeFile(wb, "pitopo_data.xlsx");
    };

    const tooltipTexts = {
        actions: 'Modify the row',
        id: 'Serial Number',
        department: 'Department abbreviation: IP (Porcelains Insulator Production), CI (Composite Insulator), AC (Advance Ceramics), NP (New Products), PT (Pouring Tube), SCR (Selective Catalytic Reaction), M&S (Maintenance & Services), DTG (Digital Transformation Group), HR (Human Resources), PR (Public Relations), MKTG (Marketing), Comm (Commercial)',
        cust: 'Customer',
        project: 'Project',
        itemType: 'Material Type: DM (Direct Materials), IDM (In-Direct Material), CA (Capital Item), CIV (Civil Item)',
        contractType: 'Contract Type: ARC (Annual Rate Contract), OT (One Time Procurement)',
        priority: 'Priority: High (impacts current/next month or delayed), Med (required after 90 days), Low (required after 120 days)',
        eofficeNumber: 'eOffice Number',
        eofficeDate: 'eOffice Received Date',
        prBy: 'PR From',
        prNumber: 'PR Number',
        prDate: 'PR Date',
        finalPrDate: 'PR Accepted Date',
        itemName: 'Item Name',
        prValue: 'PR Value Category at tendering (e.g., A: up to 50k, B: 50k-1L, C, D, ..., Z, Other: number). Mention BHEL Estimate Value at Price Bid Opening.',
        numberOfItem: 'Number of Unique Line Items in the PR',
        totalQuantity: 'Total physical quantity of the tender (e.g., 200MT, 5026 Nos)',
        uom: 'Unit of Measure: Nos, MT, Kg, L, m',
        responsible1: 'Responsible 1: MK (Manoj K), AS (Anita Sinha), NK (Niraj Kumar), PKN (P K Nagraj), YS (Yogesh Sharma), VK (Vinay Kumar)',
        responsible2: 'Responsible 2: MK (Manoj K), AS (Anita Sinha), NK (Niraj Kumar), PKN (P K Nagraj), APS (Apoorva Shukla), PL (Palani), AV (Ankur Verma), RKM (Ramendra Kumar Mach), LX (Laxmi), PKP (Pradip Kumar Pandit), AK (Amit Kumar), SS (Shashi Sharma), Others',
        status: 'Status',
        fileWith: 'Person Name with whom the eOffice file is currently available. For High priority, mention date since when file is with person in File With Comment.',
        fileWithComment: 'Comment for High priority files, including date since when file is with person',
        remarks: 'Remarks',
        rioDate: 'RIO Date',
        tenderType: 'Tender Type: OT (Open Tender), LT (Limited Tender), ST (Single Tender), DO (Direct Order), IUT (Inter Unit Tender), Email, PE (Personal Enquiry), U-ARC (Unit Annual Rate Contract), C-ARC (Corporate Annual Rate Contract)',
        platform: 'Tender Platform: GeM, NIC, Email',
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
        { key: 'fileWithComment', label: 'File With Comment', width: 250, group: 2 },
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

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (!tableData || !Array.isArray(tableData)) {
        return <Typography>Error: Data not available</Typography>;
    }

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
                            {departmentOptions.map((option) => (
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
                            {custOptions.map((option) => (
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
                            {projectOptions.map((option) => (
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
                            {itemTypeOptions.map((option) => (
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
                            {contractTypeOptions.map((option) => (
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
                            {priorityOptions.map((option) => (
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
                            {prByOptions.map((option) => (
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
                            {responsibleOptions.map((option) => (
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
                            {responsible2Options.map((option) => (
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
                            {statusOptions.map((option) => (
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
                            {platformOptions.map((option) => (
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
                            {tenderTypeOptions.map((option) => (
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
                                department: null, cust: null, project: null, itemType: null, contractType: null,
                                priority: null, prBy: null, responsible1: null, responsible2: null, status: null,
                                platform: null, tenderType: null,
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
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2">{header.label}</Typography>
                                            <InfoIcon fontSize="small" color="action" />
                                        </Box>
                                    </Tooltip>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <TableRow
                                key={row.id || index}
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

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
                <DialogTitle>{editingRowId ? 'Edit Row' : 'Add New Row'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ padding: '16px' }}>
                        <form>
                            {/* User Department Information Section */}
                            <Box className="form-section">
                                <div className="section-header-wrapper bg-blue-100">
                                    <Typography variant="h8" className="form-section-title">
                                        User Department Information
                                    </Typography>
                                </div>
                                <Grid container spacing={1.5}>
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="filled"
                                            label="ID"
                                            helperText="Unique identifier"
                                            placeholder="Enter ID"
                                            value={formData.id}
                                            onChange={(e) => handleFormChange('id', e.target.value)}
                                            disabled
                                            required
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Select
                                            variant="filled"
                                            label="Priority"
                                            value={formData.priority}
                                            onChange={(e) => handleFormChange('priority', e.target.value)}
                                            displayEmpty
                                            fullWidth
                                            size="small"
                                            required
                                        >
                                            <MenuItem value="" disabled>Select Priority</MenuItem>
                                            {priorityOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Select
                                            variant="filled"
                                            label="Department"
                                            value={formData.department}
                                            onChange={(e) => handleFormChange('department', e.target.value)}
                                            displayEmpty
                                            fullWidth
                                            size="small"
                                            required
                                        >
                                            <MenuItem value="" disabled>Select Department</MenuItem>
                                            {departmentOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="filled"
                                            label="Customer"
                                            helperText="Customer name"
                                            placeholder="Enter Customer"
                                            value={formData.cust}
                                            onChange={(e) => handleFormChange('cust', e.target.value)}
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="filled"
                                            label="Project"
                                            helperText="Project name"
                                            placeholder="Enter Project"
                                            value={formData.project}
                                            onChange={(e) => handleFormChange('project', e.target.value)}
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Select
                                            variant="filled"
                                            label="Material Type"
                                            value={formData.itemType}
                                            onChange={(e) => handleFormChange('itemType', e.target.value)}
                                            displayEmpty
                                            fullWidth
                                            size="small"
                                            required
                                        >
                                            <MenuItem value="" disabled>Select Material Type</MenuItem>
                                            {itemTypeOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Select
                                            variant="filled"
                                            label="Contract Type"
                                            value={formData.contractType}
                                            onChange={(e) => handleFormChange('contractType', e.target.value)}
                                            displayEmpty
                                            fullWidth
                                            size="small"
                                        >
                                            <MenuItem value="" disabled>Select Contract Type</MenuItem>
                                            {contractTypeOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    {dateFields
                                        .filter(field => field.section === 'User Department Information')
                                        .map(field => (
                                            <CustomDatePicker
                                                key={field.key}
                                                fieldName={field.key}
                                                label={field.label}
                                                description={field.description}
                                                formData={formData}
                                                handleFormChange={handleFormChange}
                                                editingRowId={editingRowId}
                                            />
                                        ))}
                                </Grid>
                            </Box>

                            {/* PR Information Section */}
                            <Box className="form-section">
                                <div className="section-header-wrapper bg-green-100">
                                    <Typography variant="h8" className="form-section-title">
                                        PR Information
                                    </Typography>
                                </div>
                                <Grid container spacing={1.5}>
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="filled"
                                            label="eOffice Number"
                                            helperText="eOffice reference number"
                                            placeholder="Enter eOffice Number"
                                            value={formData.eofficeNumber}
                                            onChange={(e) => handleFormChange('eofficeNumber', e.target.value)}
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>
                                    {dateFields
                                        .filter(field => field.section === 'PR Information')
                                        .map(field => (
                                            <CustomDatePicker
                                                key={field.key}
                                                fieldName={field.key}
                                                label={field.label}
                                                description={field.description}
                                                formData={formData}
                                                handleFormChange={handleFormChange}
                                                editingRowId={editingRowId}
                                            />
                                        ))}
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="filled"
                                            label="PR From"
                                            helperText="Source of PR"
                                            placeholder="Enter PR From"
                                            value={formData.prBy}
                                            onChange={(e) => handleFormChange('prBy', e.target.value)}
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="filled"
                                            label="PR Number"
                                            helperText="Purchase Requisition number"
                                            placeholder="Enter PR Number"
                                            value={formData.prNumber}
                                            onChange={(e) => handleFormChange('prNumber', e.target.value)}
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="filled"
                                            label="Item Name"
                                            helperText="Name of the item"
                                            placeholder="Enter Item Name"
                                            value={formData.itemName}
                                            onChange={(e) => handleFormChange('itemName', e.target.value)}
                                            required
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="filled"
                                            label="PR Value"
                                            helperText="Value category (e.g., A: up to 50k, B: 50k-1L)"
                                            placeholder="Enter PR Value"
                                            value={formData.prValue}
                                            onChange={(e) => handleFormChange('prValue', e.target.value)}
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="filled"
                                            label="No of Line Item"
                                            helperText="Number of unique line items"
                                            placeholder="Enter No of Line Item"
                                            value={formData.numberOfItem}
                                            onChange={(e) => handleFormChange('numberOfItem', e.target.value)}
                                            type="number"
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="filled"
                                            label="Total Quantity"
                                            helperText="Total quantity (e.g., 200MT, 5026 Nos)"
                                            placeholder="Enter Total Quantity"
                                            value={formData.totalQuantity}
                                            onChange={(e) => handleFormChange('totalQuantity', e.target.value)}
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Select
                                            variant="filled"
                                            label="UOM"
                                            value={formData.uom}
                                            onChange={(e) => handleFormChange('uom', e.target.value)}
                                            displayEmpty
                                            fullWidth
                                            size="small"
                                        >
                                            <MenuItem value="" disabled>Select UOM</MenuItem>
                                            {uomOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* MM Section */}
                            <Box className="form-section">
                                <div className="section-header-wrapper bg-yellow-100">
                                    <Typography variant="h8" className="form-section-title">
                                        MM
                                    </Typography>
                                </div>
                                <Grid container spacing={1.5}>
                                    <Grid item xs={3}>
                                        <Select
                                            variant="filled"
                                            label="Responsible 1"
                                            value={formData.responsible1}
                                            onChange={(e) => handleFormChange('responsible1', e.target.value)}
                                            displayEmpty
                                            fullWidth
                                            size="small"
                                        >
                                            <MenuItem value="" disabled>Select Responsible 1</MenuItem>
                                            {responsibleOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Select
                                            variant="filled"
                                            label="Responsible 2"
                                            value={formData.responsible2}
                                            onChange={(e) => handleFormChange('responsible2', e.target.value)}
                                            displayEmpty
                                            fullWidth
                                            size="small"
                                        >
                                            <MenuItem value="" disabled>Select Responsible 2</MenuItem>
                                            {responsible2Options.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="filled"
                                            label="Remarks"
                                            helperText="Additional comments"
                                            placeholder="Enter Remarks"
                                            value={formData.remarks}
                                            onChange={(e) => handleFormChange('remarks', e.target.value)}
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Select
                                            variant="filled"
                                            label="Status"
                                            value={formData.status}
                                            onChange={(e) => handleFormChange('status', e.target.value)}
                                            displayEmpty
                                            fullWidth
                                            size="small"
                                        >
                                            <MenuItem value="" disabled>Select Status</MenuItem>
                                            {statusOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="filled"
                                            label="eOffice File With"
                                            helperText="Person handling eOffice file"
                                            placeholder="Enter eOffice File With"
                                            value={formData.fileWith}
                                            onChange={(e) => handleFormChange('fileWith', e.target.value)}
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>
                                    {formData.priority === 'High' && (
                                        <Grid item xs={3}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    label="File With Comment"
                                                    value={formData.fileWithComment ? dayjs(formData.fileWithComment) : null}
                                                    onChange={(newValue) => handleFormChange('fileWithComment', newValue ? dayjs(newValue).format('YYYY-MM-DD') : '')}
                                                    format="YYYY-MM-DD"
                                                    slotProps={{
                                                        textField: {
                                                            variant: 'filled',
                                                            helperText: 'Date since file is with person (High priority)',
                                                            fullWidth: true,
                                                            size: 'small',
                                                            required: true,
                                                        },
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>

                            {/* Tender Information Section */}
                            <Box className="form-section">
                                <div className="section-header-wrapper bg-purple-100">
                                    <Typography variant="h8" className="form-section-title">
                                        Tender Information
                                    </Typography>
                                </div>
                                <Grid container spacing={1.5}>
                                    {dateFields
                                        .filter(field => field.section === 'Tender Information')
                                        .map(field => (
                                            <CustomDatePicker
                                                key={field.key}
                                                fieldName={field.key}
                                                label={field.label}
                                                description={field.description}
                                                formData={formData}
                                                handleFormChange={handleFormChange}
                                                editingRowId={editingRowId}
                                            />
                                        ))}
                                    <Grid item xs={3}>
                                        <Select
                                            variant="filled"
                                            label="Tender Type"
                                            value={formData.tenderType}
                                            onChange={(e) => handleFormChange('tenderType', e.target.value)}
                                            displayEmpty
                                            fullWidth
                                            size="small"
                                        >
                                            <MenuItem value="" disabled>Select Tender Type</MenuItem>
                                            {tenderTypeOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Select
                                            variant="filled"
                                            label="Tender Platform"
                                            value={formData.platform}
                                            onChange={(e) => handleFormChange('platform', e.target.value)}
                                            displayEmpty
                                            fullWidth
                                            size="small"
                                        >
                                            <MenuItem value="" disabled>Select Tender Platform</MenuItem>
                                            {platformOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* PO Information Section */}
                            <Box className="form-section">
                                <div className="section-header-wrapper bg-orange-100">
                                    <Typography variant="h8" className="form-section-title">
                                        PO Information
                                    </Typography>
                                </div>
                                <Grid container spacing={1.5}>
                                    {dateFields
                                        .filter(field => field.section === 'PO Information')
                                        .map(field => (
                                            <CustomDatePicker
                                                key={field.key}
                                                fieldName={field.key}
                                                label={field.label}
                                                description={field.description}
                                                formData={formData}
                                                handleFormChange={handleFormChange}
                                                editingRowId={editingRowId}
                                            />
                                        ))}
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="filled"
                                            label="GEM PO Number"
                                            helperText="GEM Purchase Order number"
                                            placeholder="Enter GEM PO Number"
                                            value={formData.gemPoNumber}
                                            onChange={(e) => handleFormChange('gemPoNumber', e.target.value)}
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="filled"
                                            label="SAP PO No / ARC Ref"
                                            helperText="SAP PO or ARC reference"
                                            placeholder="Enter SAP PO Number"
                                            value={formData.sapPoNumber}
                                            onChange={(e) => handleFormChange('sapPoNumber', e.target.value)}
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="filled"
                                            label="PO Value / ARC Value"
                                            helperText="Value of PO or ARC"
                                            placeholder="Enter PO Value"
                                            value={formData.poValue}
                                            onChange={(e) => handleFormChange('poValue', e.target.value)}
                                            type="number"
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="filled"
                                            label="Saving"
                                            helperText="Savings achieved"
                                            placeholder="Enter Saving"
                                            value={formData.saving}
                                            onChange={(e) => handleFormChange('saving', e.target.value)}
                                            type="number"
                                            fullWidth
                                            size="small"
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
                    <Button onClick={handleSubmit} variant="contained" size="small" disabled={submitting}>
                        {submitting ? 'Saving...' : 'Save'}
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