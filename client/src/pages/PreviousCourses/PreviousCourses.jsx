// import {Button, ConfigProvider, Input, Space, Table} from 'antd';
import { ConfigProvider, Table } from "antd";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PreviousCourses = () => {
  const [moduleType, setModuleType] = useState([]);
  const [yearFilter, setYearFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [pdfData, setPdfData] = useState([]);
  const navigate = useNavigate();

  const { setPdfPreviewData, setFiltersData, setGraphSS } = useContext(AuthContext);

  const columns = [
    {
      title: "Module Code",
      dataIndex: "moduleCode",
      align: "center",
      color: "white",
      render: (text) => <p style={{ color: "white" }}>{text}</p>,
    },
    {
      title: "Title",
      dataIndex: "title",
      align: "center",
      render: (text) => <p style={{ color: "white" }}>{text}</p>,
    },
    {
      title: "Credit Value",
      dataIndex: "moduleCredit",
      align: "center",
      render: (text) => <p style={{ color: "white" }}>{text}</p>,
    },
    {
      title: "Semester",
      dataIndex: "semester",
      align: "center",
      render: (text) => <p style={{ color: "white" }}>{text}</p>,
    },
    {
      title: "Courses",
      dataIndex: "programme",
      align: "center",
      render: (text) => <p style={{ color: "white" }}>{text}</p>,
    },
    {
      title: "Insights",
      dataIndex: "insights",
      align: "center",
      render: (item) => (
        <p
          style={{
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: "bold",
            color: "white",
          }}
          onClick={() => navigate(`/insight/${item}`)}
        >
          View Insights
        </p>
      ),
    },
  ];
  const filters = { semester: semesterFilter, course: courseFilter, year: yearFilter }
  const pdfButtonsStyle = { margin: '20px', padding: '5px', borderRadius: '8px', backgroundColor: '#b10062', color: 'white', border: 'none', cursor: 'pointer' }
  useEffect(() => {
    (async () => {
      try {
        const queryParams = new URLSearchParams(filters)
        const result = await axios.get(
          `https://sweat-e00334d180ef.herokuapp.com/module/fetch-all-codes?${queryParams}`
        );
        setPdfData(result.data)
        const modifiedData = result.data.map((obj) => {
          const { _id, ...rest } = obj;
          const finalObject = { key: _id, ...rest, insights: rest?.moduleCode }
          if (finalObject?.programme?.length) {
            finalObject.programme = finalObject?.programme?.map((e, i) => finalObject?.programme?.length - 1 > i ? `${e}, ` : e)
          }
          return finalObject;
        });
        setModuleType(modifiedData);
      } catch (e) {
        console.log({ e })
      }
    })();
  }, [yearFilter, semesterFilter, courseFilter]);

  const handlePdfPreview = () => {
    if (pdfData?.length) {
      setFiltersData({ yearFilter, semesterFilter, courseFilter })
      setGraphSS()
      setPdfPreviewData(pdfData)
      navigate('/preview-pdf')
    }
  }

  return (
    <>
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <label style={{ color: 'white', marginRight: '8px' }}>Year:</label>
        <select
          className="navDropDown"
          name="is_student"
          style={{ marginRight: '20px', backgroundColor: "#1c4966", color: 'white' }}
          id="is_student"
          onChange={(e) => setYearFilter(e.target.value)}
        >
          <option>All</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
        <label style={{ color: 'white', marginRight: '8px' }}>Semester:</label>
        <select
          className="navDropDown"
          name="is_student"
          style={{ marginRight: '20px', backgroundColor: "#1c4966", color: 'white' }}
          id="is_student"
          onChange={(e) => setSemesterFilter(e.target.value)}
        >
          <option>All</option>
          <option>First</option>
          <option>Second</option>
          <option>Whole Session</option>
        </select>
        <label style={{ color: 'white', marginRight: '8px' }}>Course:</label>
        <select
          className="navDropDown"
          name="is_student"
          style={{ backgroundColor: "#1c4966", color: 'white' }}
          id="is_student"
          onChange={(e) => setCourseFilter(e.target.value)}
        >
          <option>All</option>
          <option>CSEE</option>
          <option>AVS</option>
          <option>MCR</option>
          <option>EEE</option>
        </select>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#051650",
        }}
      >
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerColor: "white",
                headerBg: "#051650",
                borderColor: "white",
                rowHoverBg: "none",
                rowBg: "#051650",
                colorBgContainer: "#051650",
                // colorPrimary: "white"
              },
            },
          }}
        >
          <Table
            style={{ paddingTop: "4rem", marginBottom: '50px', height: "auto", width: "auto" }}
            columns={columns}
            dataSource={moduleType}
            bordered
            pagination={false}
          />
        </ConfigProvider>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button style={pdfButtonsStyle} onClick={handlePdfPreview}>Preview PDF</button>
      </div>
    </>
  );
};
export default PreviousCourses;
