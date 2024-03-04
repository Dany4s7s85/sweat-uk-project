import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import generatePDF from 'react-to-pdf';

import './preview-pdf.css'

const PreviewPdf = () => {
    const { pdfPreviewData, graphSS, filtersData } = useContext(AuthContext);
    const targetRef = useRef();
    const navigate = useNavigate();
    useEffect(() => {
        if (!pdfPreviewData?.length) {
            navigate('/')
        }
    }, [])

    const handleDownloadPdf = () => {
        generatePDF(targetRef, { filename: 'page.pdf' })
    }

    const pdfButtonsStyle = { marginTop: '20px', padding: '5px', borderRadius: '8px', backgroundColor: '#b10062', color: 'white', border: 'none', cursor: 'pointer' }

    const tableHeader = ['Module Code', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12', 'W13', 'W14', 'W15']

    const calculteData = ({ examPrep, courseworkPrep, classtestPrep, week }) => {
        let value = ''
        if (week === examPrep?.deadline) {
            value = <>
                <pre>Type: exam</pre>
                <pre>Hours: {examPrep?.studyHours}</pre>
                <pre>Weightage: {examPrep?.weightage}%</pre>
            </>
        }
        courseworkPrep.map(ele => {
            if (week === ele?.deadline) {
                value = <>
                    <pre>Type: coursework</pre>
                    <pre>Hours: {ele?.studyHours}</pre>
                    <pre>Weightage: {ele?.weightage}%</pre>
                </>
            }
        })
        classtestPrep.map(ele => {
            if (week === ele?.deadline) {
                value = <>
                    <pre>Type: coursework</pre>
                    <pre>Hours: {ele?.studyHours}</pre>
                    <pre>Weightage: {ele?.weightage}%</pre>
                </>
            }
        })
        return value
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button style={pdfButtonsStyle} onClick={handleDownloadPdf}>Download In PDF</button>
            </div>
            <div className="pdf_preview_container" ref={targetRef}>
                {filtersData &&
                    <div className="filter_data_holder">
                        <spam>Year: {filtersData?.yearFilter}</spam>
                        <spam>Semester: {filtersData?.semesterFilter}</spam>
                        <spam>Course: {filtersData?.courseFilter}</spam>
                    </div>
                }
                <div className="pdf_table_container">
                    <table className="pdf_preview_table">
                        <thead>
                            <tr style={{ backgroundColor: '#8FB868', color: '' }}>
                                {tableHeader?.map(ele => {
                                    return <td className="pdf_table_headers">{ele}</td>
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {pdfPreviewData?.length && pdfPreviewData?.map(ele => {
                                const { examPrep, courseworkPrep, classtestPrep } = ele
                                return <tr className="pdf_table_data">
                                    <td className="pdf_table_headers">{ele?.moduleCode}</td>
                                    <td>{calculteData({ examPrep, courseworkPrep, classtestPrep, week: 1 })}</td>
                                    <td>{calculteData({ examPrep, courseworkPrep, classtestPrep, week: 2 })}</td>
                                    <td>{calculteData({ examPrep, courseworkPrep, classtestPrep, week: 3 })}</td>
                                    <td>{calculteData({ examPrep, courseworkPrep, classtestPrep, week: 4 })}</td>
                                    <td>{calculteData({ examPrep, courseworkPrep, classtestPrep, week: 5 })}</td>
                                    <td>{calculteData({ examPrep, courseworkPrep, classtestPrep, week: 6 })}</td>
                                    <td>{calculteData({ examPrep, courseworkPrep, classtestPrep, week: 7 })}</td>
                                    <td>{calculteData({ examPrep, courseworkPrep, classtestPrep, week: 8 })}</td>
                                    <td>{calculteData({ examPrep, courseworkPrep, classtestPrep, week: 9 })}</td>
                                    <td>{calculteData({ examPrep, courseworkPrep, classtestPrep, week: 10 })}</td>
                                    <td>{calculteData({ examPrep, courseworkPrep, classtestPrep, week: 11 })}</td>
                                    <td>{calculteData({ examPrep, courseworkPrep, classtestPrep, week: 12 })}</td>
                                    <td>{calculteData({ examPrep, courseworkPrep, classtestPrep, week: 13 })}</td>
                                    <td>{calculteData({ examPrep, courseworkPrep, classtestPrep, week: 14 })}</td>
                                    <td>{calculteData({ examPrep, courseworkPrep, classtestPrep, week: 15 })}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="pdf_image_container">{graphSS &&
                    <div>
                        <div className="graph_data_holder">
                            <spam>Module: {graphSS?.module}</spam>
                            <spam>Study Style: {graphSS?.type}</spam>
                        </div>
                        <div style={{ width: '1160px' }}>
                            <img style={{ width: '100%', height: 'auto' }} src={graphSS?.image} />
                        </div>
                    </div>
                }</div>
            </div>
        </>
    )
}

export default PreviewPdf