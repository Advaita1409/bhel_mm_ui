import React, { useState, useEffect } from "react";
import "../styles/PitoPo.css";
import * as XLSX from 'xlsx';

const PitoPo = () => {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Column width map (converted to camelCase)
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

    // Extract unique values for dropdowns
    const uniqueValues = (key) => [...new Set(tableData.map((row) => row[key] || ""))];

    const [filters, setFilters] = useState({
        responsible1: "",
        department: "",
        status: "",
        product: "",
        itemType: "",
    });

    const [showModal, setShowModal] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);
    const [formData, setFormData] = useState({
        responsible1: "",
        department: "",
        status: "",
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
        finalPrDate: "",
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
        responsible2: "",
        remarks: "",
        submittedBy: "",
        submittedDate: "",
        project: "",
        financialYear: "",
    });

    const fetchTableData = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/purchase-monitor');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            // Map snake_case API fields to camelCase
            const mappedData = data.map(row => ({
                id: row.id,
                department: row.department,
                project: row.project,
                product: row.product,
                itemType: row.item_type,
                prBy: row.pr_by,
                prNumber: row.pr_number,
                prDate: row.pr_date,
                eofficeNumber: row.eoffice_number,
                eofficeDate: row.eoffice_date,
                itemName: row.item_name,
                materialCode: row.material_code,
                numberOfItem: row.number_of_item,
                totalQuantity: row.total_quantity,
                prValue: row.pr_value,
                responsible1: row.responsible1,
                finalPrDate: row.final_pr_date,
                responsible2: row.responsible2,
                status: row.status,
                fileWith: row.file_with,
                tenderType: row.tender_type,
                platform: row.platform,
                rfqDate: row.rfq_date,
                bidOpeningDate: row.bid_opening_date,
                technicalEval: row.technical_eval,
                commercialEval: row.commercial_eval,
                priceBidOpening: row.price_bid_opening,
                raDate: row.ra_date,
                poProposalDate: row.po_proposal_date,
                poApprovalDate: row.po_approval_date,
                poNumber: row.po_number,
                poDate: row.po_date,
                remarks: row.remarks,
                submittedBy: row.submitted_by,
                submittedDate: row.submitted_date,
                financialYear: row.financial_year,
            }));
            setTableData(mappedData);
        } catch (error) {
            console.error('Error fetching table data:', error);
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
        return (
            (filters.responsible1 === "" || row.responsible1 === filters.responsible1) &&
            (filters.department === "" || row.department === filters.department) &&
            (filters.status === "" || row.status === filters.status) &&
            (filters.product === "" || row.product === filters.product) &&
            (filters.itemType === "" || row.itemType === filters.itemType)
        );
    });

    const getStatusTagClass = (status) => {
        switch (status?.toLowerCase()) {
            case "open":
                return "status-tag open";
            case "in progress":
                return "status-tag in-progress";
            case "closed":
                return "status-tag closed";
            default:
                return "status-tag default";
        }
    };

    const handleAddNew = () => {
        setEditingRowId(null);
        setFormData({
            responsible1: "",
            department: "",
            status: "",
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
            finalPrDate: "",
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
            responsible2: "",
            remarks: "",
            submittedBy: "",
            submittedDate: "",
            project: "",
            financialYear: "",
        });
        setShowModal(true);
    };

    const handleEdit = async (row) => {
        setEditingRowId(row.id);
        try {
            const response = await fetch(`http://localhost:8080/purchase-monitor/${row.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch row data');
            }
            const data = await response.json();
            // Map snake_case API fields to camelCase
            setFormData({
                id: data.id,
                department: data.department,
                project: data.project,
                product: data.product,
                itemType: data.item_type,
                prBy: data.pr_by,
                prNumber: data.pr_number,
                prDate: data.pr_date,
                eofficeNumber: data.eoffice_number,
                eofficeDate: data.eoffice_date,
                itemName: data.item_name,
                materialCode: data.material_code,
                numberOfItem: data.number_of_item,
                totalQuantity: data.total_quantity,
                prValue: data.pr_value,
                responsible1: data.responsible1,
                finalPrDate: data.final_pr_date,
                responsible2: data.responsible2,
                status: data.status,
                fileWith: data.file_with,
                tenderType: data.tender_type,
                platform: data.platform,
                rfqDate: data.rfq_date,
                bidOpeningDate: data.bid_opening_date,
                technicalEval: data.technical_eval,
                commercialEval: data.commercial_eval,
                priceBidOpening: data.price_bid_opening,
                raDate: data.ra_date,
                poProposalDate: data.po_proposal_date,
                poApprovalDate: data.po_approval_date,
                poNumber: data.po_number,
                poDate: data.po_date,
                remarks: data.remarks,
                submittedBy: data.submitted_by,
                submittedDate: data.submitted_date,
                financialYear: data.financial_year,
            });
        } catch (error) {
            console.error('Error fetching row data:', error);
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
        // Map camelCase to snake_case for API
        const apiData = {
            id: formData.id,
            department: formData.department,
            project: formData.project,
            product: formData.product,
            item_type: formData.itemType,
            pr_by: formData.prBy,
            pr_number: formData.prNumber,
            pr_date: formData.prDate,
            eoffice_number: formData.eofficeNumber,
            eoffice_date: formData.eofficeDate,
            item_name: formData.itemName,
            material_code: formData.materialCode,
            number_of_item: formData.numberOfItem,
            total_quantity: formData.totalQuantity,
            pr_value: formData.prValue,
            responsible1: formData.responsible1,
            final_pr_date: formData.finalPrDate,
            responsible2: formData.responsible2,
            status: formData.status,
            file_with: formData.fileWith,
            tender_type: formData.tenderType,
            platform: formData.platform,
            rfq_date: formData.rfqDate,
            bid_opening_date: formData.bidOpeningDate,
            technical_eval: formData.technicalEval,
            commercial_eval: formData.commercialEval,
            price_bid_opening: formData.priceBidOpening,
            ra_date: formData.raDate,
            po_proposal_date: formData.poProposalDate,
            po_approval_date: formData.poApprovalDate,
            po_number: formData.poNumber,
            po_date: formData.poDate,
            remarks: formData.remarks,
            submitted_by: formData.submittedBy,
            submitted_date: formData.submittedDate,
            financial_year: formData.financialYear,
        };
        try {
            if (editingRowId) {
                const response = await fetch(`http://localhost:8080/purchase-monitor/${editingRowId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(apiData),
                });
                if (!response.ok) {
                    throw new Error('Failed to update row');
                }
            } else {
                const response = await fetch('http://localhost:8080/purchase-monitor', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(apiData),
                });
                if (!response.ok) {
                    throw new Error('Failed to add new row');
                }
            }
            fetchTableData();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
        setShowModal(false);
    };

    const handleExport = () => {
        // Map camelCase to snake_case for export using filteredData
        const exportData = filteredData.map(row => ({
            id: row.id,
            department: row.department,
            project: row.project,
            product: row.product,
            item_type: row.itemType,
            pr_by: row.prBy,
            pr_number: row.prNumber,
            pr_date: row.prDate,
            eoffice_number: row.eofficeNumber,
            eoffice_date: row.eofficeDate,
            item_name: row.itemName,
            material_code: row.materialCode,
            number_of_item: row.numberOfItem,
            total_quantity: row.totalQuantity,
            pr_value: row.prValue,
            responsible1: row.responsible1,
            final_pr_date: row.finalPrDate,
            responsible2: row.responsible2,
            status: row.status,
            file_with: row.fileWith,
            tender_type: row.tenderType,
            platform: row.platform,
            rfq_date: row.rfqDate,
            bid_opening_date: row.bidOpeningDate,
            technical_eval: row.technicalEval,
            commercial_eval: row.commercialEval,
            price_bid_opening: row.priceBidOpening,
            ra_date: row.raDate,
            po_proposal_date: row.poProposalDate,
            po_approval_date: row.poApprovalDate,
            po_number: row.poNumber,
            po_date: row.poDate,
            remarks: row.remarks,
            submitted_by: row.submittedBy,
            submitted_date: row.submittedDate,
            financial_year: row.financialYear,
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "PI to PO Data");
        XLSX.writeFile(wb, "pitopo_data.xlsx");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="pitopo-container">
            <h2 className="pitopo-title">PI to PO Monitoring</h2>

            {/* Filters */}
            <div className="filters-container">
                <div className="filter-box">
                    <span className="filter-icon">👤</span>
                    <select
                        name="responsible1"
                        value={filters.responsible1}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Responsible</option>
                        {uniqueValues("responsible1").map((val) => (
                            <option key={val} value={val}>
                                {val}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-box">
                    <span className="filter-icon">🏢</span>
                    <select
                        name="department"
                        value={filters.department}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Departments</option>
                        {uniqueValues("department").map((val) => (
                            <option key={val} value={val}>
                                {val}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-box">
                    <span className="filter-icon">📌</span>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Status</option>
                        {uniqueValues("status").map((val) => (
                            <option key={val} value={val}>
                                {val}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-box">
                    <span className="filter-icon">📦</span>
                    <select
                        name="product"
                        value={filters.product}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Products</option>
                        {uniqueValues("product").map((val) => (
                            <option key={val} value={val}>
                                {val}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-box">
                    <span className="filter-icon">🔖</span>
                    <select
                        name="itemType"
                        value={filters.itemType}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Item Types</option>
                        {uniqueValues("itemType").map((val) => (
                            <option key={val} value={val}>
                                {val}
                            </option>
                        ))}
                    </select>
                </div>

                <button className="action-btn add-new" onClick={handleAddNew}>Add new line</button>
                <button className="action-btn export" onClick={handleExport}>Export to excel</button>
            </div>

            {/* Table */}
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
                                <td style={{ width: columnWidths.financialYear }}>{row.financialYear}</td>
                                <td style={{ width: columnWidths.id }}>{row.id}</td>
                                <td style={{ width: columnWidths.department }}>{row.department}</td>
                                <td style={{ width: columnWidths.project }}>{row.project}</td>
                                <td style={{ width: columnWidths.product }}>{row.product}</td>
                                <td style={{ width: columnWidths.itemType }}>{row.itemType}</td>
                                <td style={{ width: columnWidths.prBy }}>{row.prBy}</td>
                                <td style={{ width: columnWidths.prNumber }}>{row.prNumber}</td>
                                <td style={{ width: columnWidths.prDate }}>{row.prDate}</td>
                                <td style={{ width: columnWidths.eofficeNumber }}>{row.eofficeNumber}</td>
                                <td style={{ width: columnWidths.eofficeDate }}>{row.eofficeDate}</td>
                                <td style={{ width: columnWidths.itemName }}>{row.itemName}</td>
                                <td style={{ width: columnWidths.materialCode }}>{row.materialCode}</td>
                                <td style={{ width: columnWidths.numberOfItem }}>{row.numberOfItem}</td>
                                <td style={{ width: columnWidths.totalQuantity }}>{row.totalQuantity}</td>
                                <td style={{ width: columnWidths.prValue }}>{row.prValue}</td>
                                <td style={{ width: columnWidths.responsible1 }}>{row.responsible1}</td>
                                <td style={{ width: columnWidths.finalPrDate }}>{row.finalPrDate}</td>
                                <td style={{ width: columnWidths.responsible2 }}>{row.responsible2}</td>
                                <td style={{ width: columnWidths.status }}>
                                    <span className={getStatusTagClass(row.status)}>{row.status}</span>
                                </td>
                                <td style={{ width: columnWidths.fileWith }}>{row.fileWith}</td>
                                <td style={{ width: columnWidths.tenderType }}>{row.tenderType}</td>
                                <td style={{ width: columnWidths.platform }}>{row.platform}</td>
                                <td style={{ width: columnWidths.rfqDate }}>{row.rfqDate}</td>
                                <td style={{ width: columnWidths.bidOpeningDate }}>{row.bidOpeningDate}</td>
                                <td style={{ width: columnWidths.technicalEval }}>{row.technicalEval}</td>
                                <td style={{ width: columnWidths.commercialEval }}>{row.commercialEval}</td>
                                <td style={{ width: columnWidths.priceBidOpening }}>{row.priceBidOpening}</td>
                                <td style={{ width: columnWidths.raDate }}>{row.raDate}</td>
                                <td style={{ width: columnWidths.poProposalDate }}>{row.poProposalDate}</td>
                                <td style={{ width: columnWidths.poApprovalDate }}>{row.poApprovalDate}</td>
                                <td style={{ width: columnWidths.poNumber }}>{row.poNumber}</td>
                                <td style={{ width: columnWidths.poDate }}>{row.poDate}</td>
                                <td style={{ width: columnWidths.remarks }}>{row.remarks}</td>
                                <td style={{ width: columnWidths.submittedBy }}>{row.submittedBy}</td>
                                <td style={{ width: columnWidths.submittedDate }}>{row.submittedDate}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="37" className="no-data">
                                No records found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Popup Modal for Add/Edit */}
            {showModal && (
                <div className="popup-modal">
                    <div className="popup-content">
                        <h2>{editingRowId ? 'Edit Row' : 'Add New Row'}</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label>Responsible 1</label>
                                <input type="text" name="responsible1" value={formData.responsible1} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <input type="text" name="department" value={formData.department} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <input type="text" name="status" value={formData.status} onChange={handleFormChange} />
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
                                <input type="date" name="prDate" value={formData.prDate} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>eOffice Number</label>
                                <input type="text" name="eofficeNumber" value={formData.eofficeNumber} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>eOffice Date</label>
                                <input type="date" name="eofficeDate" value={formData.eofficeDate} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Item Name</label>
                                <input type="text" name="itemName" value={formData.itemName} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Material Code</label>
                                <input type="text" name="materialCode" value={formData.materialCode} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Number of Item</label>
                                <input type="number" name="numberOfItem" value={formData.numberOfItem} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Total Quantity</label>
                                <input type="number" name="totalQuantity" value={formData.totalQuantity} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>PR Value</label>
                                <input type="number" name="prValue" value={formData.prValue} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Final PR Date</label>
                                <input type="date" name="finalPrDate" value={formData.finalPrDate} onChange={handleFormChange} />
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
                                <input type="date" name="rfqDate" value={formData.rfqDate} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Bid Opening Date</label>
                                <input type="date" name="bidOpeningDate" value={formData.bidOpeningDate} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Technical Eval</label>
                                <input type="text" name="technicalEval" value={formData.technicalEval} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Commercial Eval</label>
                                <input type="text" name="commercialEval" value={formData.commercialEval} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Price Bid Opening</label>
                                <input type="date" name="priceBidOpening" value={formData.priceBidOpening} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>RA Date</label>
                                <input type="date" name="raDate" value={formData.raDate} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>PO Proposal Date</label>
                                <input type="date" name="poProposalDate" value={formData.poProposalDate} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>PO Approval Date</label>
                                <input type="date" name="poApprovalDate" value={formData.poApprovalDate} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>PO Number</label>
                                <input type="text" name="poNumber" value={formData.poNumber} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>PO Date</label>
                                <input type="date" name="poDate" value={formData.poDate} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Responsible 2</label>
                                <input type="text" name="responsible2" value={formData.responsible2} onChange={handleFormChange} />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label>Remarks</label>
                                <textarea name="remarks" value={formData.remarks} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Submitted By</label>
                                <input type="text" name="submittedBy" value={formData.submittedBy} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Submitted Date</label>
                                <input type="date" name="submittedDate" value={formData.submittedDate} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Project</label>
                                <input type="text" name="project" value={formData.project} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Financial Year</label>
                                <input type="text" name="financialYear" value={formData.financialYear} onChange={handleFormChange} />
                            </div>
                            <div className="form-actions" style={{ gridColumn: 'span 2' }}>
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