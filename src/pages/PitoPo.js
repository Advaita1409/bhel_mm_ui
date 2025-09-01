import React, { useState, useEffect } from "react";
import "../styles/PitoPo.css";
import * as XLSX from 'xlsx';

const PitoPo = () => {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);

    const columnWidths = {
        modify: "80px",
        financialYear: "150px",
        id: "60px",
        department: "220px",
        project: "250px",
        product: "220px",
        itemType: "150px",
        prBy: "220px",
        prNumber: "200px",
        prDate: "180px",
        eofficeNumber: "200px",
        eofficeDate: "180px",
        itemName: "250px",
        materialCode: "200px",
        numberOfItem: "150px",
        totalQuantity: "150px",
        prValue: "150px",
        responsible1: "220px",
        finalPrDate: "180px",
        responsible2: "220px",
        status: "150px",
        fileWith: "220px",
        tenderType: "200px",
        platform: "200px",
        rfqDate: "180px",
        bidOpeningDate: "180px",
        technicalEval: "220px",
        commercialEval: "220px",
        priceBidOpening: "180px",
        raDate: "180px",
        poProposalDate: "180px",
        poApprovalDate: "180px",
        poNumber: "200px",
        poDate: "180px",
        remarks: "300px",
        submittedBy: "220px",
        submittedDate: "180px",
};

    const uniqueValues = (key) => [...new Set(tableData.map((row) => row[key] || ""))].sort();

    const [filters, setFilters] = useState({
        department: "",
        project: "",
        product: "",
        itemType: "",
        prBy: "",
        responsible1: "",
        responsible2: "",
        status: "",
        platform: "",
        tenderType: "",
    });

    const [showModal, setShowModal] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);
    const [formData, setFormData] = useState({
        id: "",
        department: "",
        project: "",
        product: "",
        itemType: "",
        prBy: "",
        prNumber: "",
        prDate: "",
        eofficeNumber: "",
        eofficeDate: "",
        itemName: "",
        materialCode: "",
        numberOfItem: "",
        totalQuantity: "",
        prValue: "",
        responsible1: "",
        finalPrDate: "",
        responsible2: "",
        status: "",
        fileWith: "",
        tenderType: "",
        platform: "",
        rfqDate: "",
        bidOpeningDate: "",
        technicalEval: "",
        commercialEval: "",
        priceBidOpening: "",
        raDate: "",
        poProposalDate: "",
        poApprovalDate: "",
        poNumber: "",
        poDate: "",
        remarks: "",
        submittedBy: "",
        submittedDate: "",
        financialYear: "",
    });

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
            console.log('API Response:', data);
            const mappedData = data.map(row => ({
                id: row.id || '',
                department: row.department || '',
                project: row.project || '',
                product: row.product || '',
                itemType: row.itemType || '',
                prBy: row.prBy || '',
                prNumber: row.prNumber || '',
                prDate: row.prDate || '',
                eofficeNumber: row.eofficeNumber || '',
                eofficeDate: row.eofficeDate || '',
                itemName: row.itemName || '',
                materialCode: row.materialCode || '',
                numberOfItem: row.numberOfItem || '',
                totalQuantity: row.totalQuantity || '',
                prValue: row.prValue || '',
                responsible1: row.responsible1 || '',
                finalPrDate: row.finalPrDate || '',
                responsible2: row.responsible2 || '',
                status: row.status || '',
                fileWith: row.fileWith || '',
                tenderType: row.tenderType || '',
                platform: row.platform || '',
                rfqDate: row.rfqDate || '',
                bidOpeningDate: row.bidOpeningDate || '',
                technicalEval: row.technicalEval || '',
                commercialEval: row.commercialEval || '',
                priceBidOpening: row.priceBidOpening || '',
                raDate: row.raDate || '',
                poProposalDate: row.poProposalDate || '',
                poApprovalDate: row.poApprovalDate || '',
                poNumber: row.poNumber || '',
                poDate: row.poDate || '',
                remarks: row.remarks || '',
                submittedBy: row.submittedBy || '',
                submittedDate: row.submittedDate || '',
                financialYear: row.financialYear || '',
            }));
            console.log('Mapped Data:', mappedData);
            // Sort the mapped data by id in ascending order
            mappedData.sort((a, b) => {
                const idA = a.id.toString();
                const idB = b.id.toString();
                return idA.localeCompare(idB, undefined, { numeric: true });
            });
            setTableData(mappedData);
        } catch (error) {
            console.error('Error fetching table data:', error);
            alert(`Error fetching data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTableData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const filteredData = tableData.filter((row) => {
        return Object.keys(filters).every((key) => {
            return !filters[key] || (row[key] && row[key].toString() === filters[key].toString());
        });
    });

    const getStatusTagClass = (status) => {
        switch (status?.toLowerCase()) {
            case "open": return "status-tag open";
            case "in progress": return "status-tag in-progress";
            case "closed": return "status-tag closed";
            default: return "status-tag default";
        }
    };

    const handleAddNew = () => {
        setEditingRowId(null);
        setFormData({
            department: "",
            project: "",
            product: "",
            itemType: "",
            prBy: "",
            prNumber: "",
            prDate: "",
            eofficeNumber: "",
            eofficeDate: "",
            itemName: "",
            materialCode: "",
            numberOfItem: "",
            totalQuantity: "",
            prValue: "",
            responsible1: "",
            finalPrDate: "",
            responsible2: "",
            status: "",
            fileWith: "",
            tenderType: "",
            platform: "",
            rfqDate: "",
            bidOpeningDate: "",
            technicalEval: "",
            commercialEval: "",
            priceBidOpening: "",
            raDate: "",
            poProposalDate: "",
            poApprovalDate: "",
            poNumber: "",
            poDate: "",
            remarks: "",
            submittedBy: "",
            submittedDate: "",
            financialYear: "",
        });
        setShowModal(true);
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
                project: data.project || '',
                product: data.product || '',
                itemType: data.itemType || '',
                prBy: data.prBy || '',
                prNumber: data.prNumber || '',
                prDate: data.prDate || '',
                eofficeNumber: data.eofficeNumber || '',
                eofficeDate: data.eofficeDate || '',
                itemName: data.itemName || '',
                materialCode: data.materialCode || '',
                numberOfItem: data.numberOfItem || '',
                totalQuantity: data.totalQuantity || '',
                prValue: data.prValue || '',
                responsible1: data.responsible1 || '',
                finalPrDate: data.finalPrDate || '',
                responsible2: data.responsible2 || '',
                status: data.status || '',
                fileWith: data.fileWith || '',
                tenderType: data.tenderType || '',
                platform: data.platform || '',
                rfqDate: data.rfqDate || '',
                bidOpeningDate: data.bidOpeningDate || '',
                technicalEval: data.technicalEval || '',
                commercialEval: data.commercialEval || '',
                priceBidOpening: data.priceBidOpening || '',
                raDate: data.raDate || '',
                poProposalDate: data.poProposalDate || '',
                poApprovalDate: data.poApprovalDate || '',
                poNumber: data.poNumber || '',
                poDate: data.poDate || '',
                remarks: data.remarks || '',
                submittedBy: data.submittedBy || '',
                submittedDate: data.submittedDate || '',
                financialYear: data.financialYear || '',
            });
        } catch (error) {
            console.error('Error fetching row data:', error);
            alert(`Error fetching row data: ${error.message}`);
            setFormData({ ...row });
        }
        setShowModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Prepare the data for the API, excluding id for new records
        const apiData = {
            department: formData.department || null,
            project: formData.project || null,
            product: formData.product || null,
            itemType: formData.itemType || null,
            prBy: formData.prBy || null,
            prNumber: formData.prNumber || null,
            prDate: formData.prDate || null,
            eofficeNumber: formData.eofficeNumber || null,
            eofficeDate: formData.eofficeDate || null,
            itemName: formData.itemName || null,
            materialCode: formData.materialCode || null,
            numberOfItem: formData.numberOfItem ? parseInt(formData.numberOfItem) : null,
            totalQuantity: formData.totalQuantity ? parseInt(formData.totalQuantity) : null,
            prValue: formData.prValue ? parseFloat(formData.prValue) : null,
            responsible1: formData.responsible1 || null,
            finalPrDate: formData.finalPrDate || null,
            responsible2: formData.responsible2 || null,
            status: formData.status || null,
            fileWith: formData.fileWith || null,
            tenderType: formData.tenderType || null,
            platform: formData.platform || null,
            rfqDate: formData.rfqDate || null,
            bidOpeningDate: formData.bidOpeningDate || null,
            technicalEval: formData.technicalEval || null,
            commercialEval: formData.commercialEval || null,
            priceBidOpening: formData.priceBidOpening || null,
            raDate: formData.raDate || null,
            poProposalDate: formData.poProposalDate || null,
            poApprovalDate: formData.poApprovalDate || null,
            poNumber: formData.poNumber || null,
            poDate: formData.poDate || null,
            remarks: formData.remarks || null,
            submittedBy: formData.submittedBy || null,
            submittedDate: formData.submittedDate || null,
            financialYear: formData.financialYear || null,
        };

        try {
            // Validate required fields
            if (!formData.department || !formData.itemName) {
                alert('Department and Item Name are required.');
                return;
            }

            console.log('Submitting payload:', JSON.stringify(apiData, null, 2));

            if (editingRowId) {
                // Update existing record
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
                    console.error('Response Headers:', response.headers);
                    throw new Error(`Failed to update row: ${response.status} ${errorText}`);
                }
                console.log('Row updated successfully');
            } else {
                // Add new record
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
                    console.error('Response Headers:', response.headers);
                    console.error('Response Body:', errorText);
                    throw new Error(`Failed to add new row: ${response.status} ${errorText}`);
                }
                console.log('New row added successfully');
            }
            await fetchTableData();
            setShowModal(false);
            setEditingRowId(null);
            setFormData({
                department: "",
                project: "",
                product: "",
                itemType: "",
                prBy: "",
                prNumber: "",
                prDate: "",
                eofficeNumber: "",
                eofficeDate: "",
                itemName: "",
                materialCode: "",
                numberOfItem: "",
                totalQuantity: "",
                prValue: "",
                responsible1: "",
                finalPrDate: "",
                responsible2: "",
                status: "",
                fileWith: "",
                tenderType: "",
                platform: "",
                rfqDate: "",
                bidOpeningDate: "",
                technicalEval: "",
                commercialEval: "",
                priceBidOpening: "",
                raDate: "",
                poProposalDate: "",
                poApprovalDate: "",
                poNumber: "",
                poDate: "",
                remarks: "",
                submittedBy: "",
                submittedDate: "",
                financialYear: "",
            });
        } catch (error) {
            console.error('Error submitting form:', error.message);
            alert(`Error: ${error.message}`);
        }
    };

    const handleExport = () => {
        const exportData = filteredData.map(row => ({
            financialYear: row.financialYear || '-',
            id: row.id || '-',
            department: row.department || '-',
            project: row.project || '-',
            product: row.product || '-',
            itemType: row.itemType || '-',
            prBy: row.prBy || '-',
            prNumber: row.prNumber || '-',
            prDate: row.prDate || '-',
            eofficeNumber: row.eofficeNumber || '-',
            eofficeDate: row.eofficeDate || '-',
            itemName: row.itemName || '-',
            materialCode: row.materialCode || '-',
            numberOfItem: row.numberOfItem || '-',
            totalQuantity: row.totalQuantity || '-',
            prValue: row.prValue || '-',
            responsible1: row.responsible1 || '-',
            finalPrDate: row.finalPrDate || '-',
            responsible2: row.responsible2 || '-',
            status: row.status || '-',
            fileWith: row.fileWith || '-',
            tenderType: row.tenderType || '-',
            platform: row.platform || '-',
            rfqDate: row.rfqDate || '-',
            bidOpeningDate: row.bidOpeningDate || '-',
            technicalEval: row.technicalEval || '-',
            commercialEval: row.commercialEval || '-',
            priceBidOpening: row.priceBidOpening || '-',
            raDate: row.raDate || '-',
            poProposalDate: row.poProposalDate || '-',
            poApprovalDate: row.poApprovalDate || '-',
            poNumber: row.poNumber || '-',
            poDate: row.poDate || '-',
            remarks: row.remarks || '-',
            submittedBy: row.submittedBy || '-',
            submittedDate: row.submittedDate || '-',
        }));
        const ws = XLSX.utils.json_to_sheet(exportData, {
            header: [
                'financialYear', 'id', 'department', 'project', 'product', 'itemType', 'prBy',
                'prNumber', 'prDate', 'eofficeNumber', 'eofficeDate', 'itemName', 'materialCode',
                'numberOfItem', 'totalQuantity', 'prValue', 'responsible1', 'finalPrDate',
                'responsible2', 'status', 'fileWith', 'tenderType', 'platform', 'rfqDate',
                'bidOpeningDate', 'technicalEval', 'commercialEval', 'priceBidOpening', 'raDate',
                'poProposalDate', 'poApprovalDate', 'poNumber', 'poDate', 'remarks',
                'submittedBy', 'submittedDate'
            ]
        });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "PI to PO Data");
        XLSX.writeFile(wb, "pitopo_data.xlsx");
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="pitopo-container">
            <h2 className="pitopo-title">PI to PO Monitoring</h2>

            <div className="filters-container">
                <div className="filter-box">
                    <span className="filter-icon">🏢</span>
                    <select name="department" value={filters.department} onChange={handleFilterChange}>
                        <option value="">All Departments</option>
                        {uniqueValues("department").map((val) => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-box">
                    <span className="filter-icon">📋</span>
                    <select name="project" value={filters.project} onChange={handleFilterChange}>
                        <option value="">All Projects</option>
                        {uniqueValues("project").map((val) => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-box">
                    <span className="filter-icon">📦</span>
                    <select name="product" value={filters.product} onChange={handleFilterChange}>
                        <option value="">All Products</option>
                        {uniqueValues("product").map((val) => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-box">
                    <span className="filter-icon">🔖</span>
                    <select name="itemType" value={filters.itemType} onChange={handleFilterChange}>
                        <option value="">All Item Types</option>
                        {uniqueValues("itemType").map((val) => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-box">
                    <span className="filter-icon">👤</span>
                    <select name="prBy" value={filters.prBy} onChange={handleFilterChange}>
                        <option value="">All PR By</option>
                        {uniqueValues("prBy").map((val) => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-box">
                    <span className="filter-icon">👤</span>
                    <select name="responsible1" value={filters.responsible1} onChange={handleFilterChange}>
                        <option value="">All Responsible 1</option>
                        {uniqueValues("responsible1").map((val) => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-box">
                    <span className="filter-icon">👤</span>
                    <select name="responsible2" value={filters.responsible2} onChange={handleFilterChange}>
                        <option value="">All Responsible 2</option>
                        {uniqueValues("responsible2").map((val) => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-box">
                    <span className="filter-icon">📌</span>
                    <select name="status" value={filters.status} onChange={handleFilterChange}>
                        <option value="">All Status</option>
                        {uniqueValues("status").map((val) => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-box">
                    <span className="filter-icon">🌐</span>
                    <select name="platform" value={filters.platform} onChange={handleFilterChange}>
                        <option value="">All Platforms</option>
                        {uniqueValues("platform").map((val) => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-box">
                    <span className="filter-icon">📜</span>
                    <select name="tenderType" value={filters.tenderType} onChange={handleFilterChange}>
                        <option value="">All Tender Types</option>
                        {uniqueValues("tenderType").map((val) => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                </div>
                <button className="action-btn add-new" onClick={handleAddNew}>Add new line</button>
                <button className="action-btn export" onClick={handleExport}>Export to excel</button>
            </div>

            <div className="table-container">
                <table className="pitopo-table">
                    <thead>
                    <tr>
                        <th style={{ width: columnWidths.modify }}>Modify</th>
                        <th style={{ width: columnWidths.financialYear }}>Financial Year</th>
                        <th style={{ width: columnWidths.id }}>ID</th>
                        <th style={{ width: columnWidths.department }}>Department</th>
                        <th style={{ width: columnWidths.project }}>Project</th>
                        <th style={{ width: columnWidths.product }}>Product</th>
                        <th style={{ width: columnWidths.itemType }}>Item Type</th>
                        <th style={{ width: columnWidths.prBy }}>PR By</th>
                        <th style={{ width: columnWidths.prNumber }}>PR Number</th>
                        <th style={{ width: columnWidths.prDate }}>PR Date</th>
                        <th style={{ width: columnWidths.eofficeNumber }}>eOffice Number</th>
                        <th style={{ width: columnWidths.eofficeDate }}>eOffice Date</th>
                        <th style={{ width: columnWidths.itemName }}>Item Name</th>
                        <th style={{ width: columnWidths.materialCode }}>Material Code</th>
                        <th style={{ width: columnWidths.numberOfItem }}>Number of Item</th>
                        <th style={{ width: columnWidths.totalQuantity }}>Total Quantity</th>
                        <th style={{ width: columnWidths.prValue }}>PR Value</th>
                        <th style={{ width: columnWidths.responsible1 }}>Responsible 1</th>
                        <th style={{ width: columnWidths.finalPrDate }}>Final PR Date</th>
                        <th style={{ width: columnWidths.responsible2 }}>Responsible 2</th>
                        <th style={{ width: columnWidths.status }}>Status</th>
                        <th style={{ width: columnWidths.fileWith }}>File With</th>
                        <th style={{ width: columnWidths.tenderType }}>Tender Type</th>
                        <th style={{ width: columnWidths.platform }}>Platform</th>
                        <th style={{ width: columnWidths.rfqDate }}>RFQ Date</th>
                        <th style={{ width: columnWidths.bidOpeningDate }}>Bid Opening Date</th>
                        <th style={{ width: columnWidths.technicalEval }}>Technical Eval</th>
                        <th style={{ width: columnWidths.commercialEval }}>Commercial Eval</th>
                        <th style={{ width: columnWidths.priceBidOpening }}>Price Bid Opening</th>
                        <th style={{ width: columnWidths.raDate }}>RA Date</th>
                        <th style={{ width: columnWidths.poProposalDate }}>PO Proposal Date</th>
                        <th style={{ width: columnWidths.poApprovalDate }}>PO Approval Date</th>
                        <th style={{ width: columnWidths.poNumber }}>PO Number</th>
                        <th style={{ width: columnWidths.poDate }}>PO Date</th>
                        <th style={{ width: columnWidths.remarks }}>Remarks</th>
                        <th style={{ width: columnWidths.submittedBy }}>Submitted By</th>
                        <th style={{ width: columnWidths.submittedDate }}>Submitted Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.length > 0 ? (
                        filteredData.map((row) => (
                            <tr key={row.id}>
                                <td style={{ width: columnWidths.modify }}>
                                    <button className="action-btn" onClick={() => handleEdit(row)}>✏️</button>
                                </td>
                                <td style={{ width: columnWidths.financialYear }}>{row.financialYear || '-'}</td>
                                <td style={{ width: columnWidths.id }}>{row.id || '-'}</td>
                                <td style={{ width: columnWidths.department }}>{row.department || '-'}</td>
                                <td style={{ width: columnWidths.project }}>{row.project || '-'}</td>
                                <td style={{ width: columnWidths.product }}>{row.product || '-'}</td>
                                <td style={{ width: columnWidths.itemType }}>{row.itemType || '-'}</td>
                                <td style={{ width: columnWidths.prBy }}>{row.prBy || '-'}</td>
                                <td style={{ width: columnWidths.prNumber }}>{row.prNumber || '-'}</td>
                                <td style={{ width: columnWidths.prDate }}>{row.prDate || '-'}</td>
                                <td style={{ width: columnWidths.eofficeNumber }}>{row.eofficeNumber || '-'}</td>
                                <td style={{ width: columnWidths.eofficeDate }}>{row.eofficeDate || '-'}</td>
                                <td style={{ width: columnWidths.itemName }}>{row.itemName || '-'}</td>
                                <td style={{ width: columnWidths.materialCode }}>{row.materialCode || '-'}</td>
                                <td style={{ width: columnWidths.numberOfItem }}>{row.numberOfItem || '-'}</td>
                                <td style={{ width: columnWidths.totalQuantity }}>{row.totalQuantity || '-'}</td>
                                <td style={{ width: columnWidths.prValue }}>{row.prValue || '-'}</td>
                                <td style={{ width: columnWidths.responsible1 }}>{row.responsible1 || '-'}</td>
                                <td style={{ width: columnWidths.finalPrDate }}>{row.finalPrDate || '-'}</td>
                                <td style={{ width: columnWidths.responsible2 }}>{row.responsible2 || '-'}</td>
                                <td style={{ width: columnWidths.status }}>
                                    <span className={getStatusTagClass(row.status)}>{row.status || '-'}</span>
                                </td>
                                <td style={{ width: columnWidths.fileWith }}>{row.fileWith || '-'}</td>
                                <td style={{ width: columnWidths.tenderType }}>{row.tenderType || '-'}</td>
                                <td style={{ width: columnWidths.platform }}>{row.platform || '-'}</td>
                                <td style={{ width: columnWidths.rfqDate }}>{row.rfqDate || '-'}</td>
                                <td style={{ width: columnWidths.bidOpeningDate }}>{row.bidOpeningDate || '-'}</td>
                                <td style={{ width: columnWidths.technicalEval }}>{row.technicalEval || '-'}</td>
                                <td style={{ width: columnWidths.commercialEval }}>{row.commercialEval || '-'}</td>
                                <td style={{ width: columnWidths.priceBidOpening }}>{row.priceBidOpening || '-'}</td>
                                <td style={{ width: columnWidths.raDate }}>{row.raDate || '-'}</td>
                                <td style={{ width: columnWidths.poProposalDate }}>{row.poProposalDate || '-'}</td>
                                <td style={{ width: columnWidths.poApprovalDate }}>{row.poApprovalDate || '-'}</td>
                                <td style={{ width: columnWidths.poNumber }}>{row.poNumber || '-'}</td>
                                <td style={{ width: columnWidths.poDate }}>{row.poDate || '-'}</td>
                                <td style={{ width: columnWidths.remarks }}>{row.remarks || '-'}</td>
                                <td style={{ width: columnWidths.submittedBy }}>{row.submittedBy || '-'}</td>
                                <td style={{ width: columnWidths.submittedDate }}>{row.submittedDate || '-'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="37" className="no-data">No records found</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="popup-modal">
                    <div className="popup-content">
                        <h2>{editingRowId ? 'Edit Row' : 'Add New Row'}</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                            <div className="form-group">
                                <label>Financial Year</label>
                                <input type="text" name="financialYear" value={formData.financialYear} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>ID</label>
                                <input type="text" name="id" value={formData.id} onChange={handleFormChange} disabled />
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <input type="text" name="department" value={formData.department} onChange={handleFormChange} required />
                            </div>
                            <div className="form-group">
                                <label>Project</label>
                                <input type="text" name="project" value={formData.project} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Product</label>
                                <input type="text" name="product" value={formData.product} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Item Type</label>
                                <input type="text" name="itemType" value={formData.itemType} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>PR By</label>
                                <input type="text" name="prBy" value={formData.prBy} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>PR Number</label>
                                <input type="text" name="prNumber" value={formData.prNumber} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>PR Date</label>
                                <input type="date" name="prDate" value={formData.prDate || ''} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>eOffice Number</label>
                                <input type="text" name="eofficeNumber" value={formData.eofficeNumber} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>eOffice Date</label>
                                <input type="date" name="eofficeDate" value={formData.eofficeDate || ''} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Item Name</label>
                                <input type="text" name="itemName" value={formData.itemName} onChange={handleFormChange} required />
                            </div>
                            <div className="form-group">
                                <label>Material Code</label>
                                <input type="text" name="materialCode" value={formData.materialCode} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Number of Item</label>
                                <input type="number" name="numberOfItem" value={formData.numberOfItem || ''} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Total Quantity</label>
                                <input type="number" name="totalQuantity" value={formData.totalQuantity || ''} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>PR Value</label>
                                <input type="number" name="prValue" value={formData.prValue || ''} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Responsible 1</label>
                                <input type="text" name="responsible1" value={formData.responsible1} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Final PR Date</label>
                                <input type="date" name="finalPrDate" value={formData.finalPrDate || ''} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Responsible 2</label>
                                <input type="text" name="responsible2" value={formData.responsible2} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <input type="text" name="status" value={formData.status} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>File With</label>
                                <input type="text" name="fileWith" value={formData.fileWith} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Tender Type</label>
                                <input type="text" name="tenderType" value={formData.tenderType} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Platform</label>
                                <input type="text" name="platform" value={formData.platform} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>RFQ Date</label>
                                <input type="date" name="rfqDate" value={formData.rfqDate || ''} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Bid Opening Date</label>
                                <input type="date" name="bidOpeningDate" value={formData.bidOpeningDate || ''} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Technical Eval</label>
                                <input type="date" name="technicalEval" value={formData.technicalEval || ''} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Commercial Eval</label>
                                <input type="date" name="commercialEval" value={formData.commercialEval || ''} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Price Bid Opening</label>
                                <input type="date" name="priceBidOpening" value={formData.priceBidOpening || ''} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>RA Date</label>
                                <input type="date" name="raDate" value={formData.raDate || ''} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>PO Proposal Date</label>
                                <input type="date" name="poProposalDate" value={formData.poProposalDate || ''} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>PO Approval Date</label>
                                <input type="date" name="poApprovalDate" value={formData.poApprovalDate || ''} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>PO Number</label>
                                <input type="text" name="poNumber" value={formData.poNumber || ''} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>PO Date</label>
                                <input type="date" name="poDate" value={formData.poDate || ''} onChange={handleFormChange} />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 4' }}>
                                <label>Remarks</label>
                                <textarea name="remarks" value={formData.remarks} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Submitted By</label>
                                <input type="text" name="submittedBy" value={formData.submittedBy} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Submitted Date</label>
                                <input type="date" name="submittedDate" value={formData.submittedDate || ''} onChange={handleFormChange} />
                            </div>
                            <div className="form-actions" style={{ gridColumn: 'span 4' }}>
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PitoPo;