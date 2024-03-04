import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from '../../context/authContext';
import "./DetailsModal.css";
import DetailsTable from "../EditableTable/DetailsTable";
import DetailsTable2 from "../EditableTable/DetailsTable2";
import { toast } from 'react-toastify'
import { Button, Input } from "antd";
import axios from "axios";

const DetailsModal = ({
  toggleModal,
  hours,
  secondTableData,
  moduleCode,
  timetabledHours,
  credits,
  newValues
}) => {
  const [teachingsData, setTeachingsData] = useState();
  const [assessmentsData, setAssessmentsData] = useState();
  const [studyyear, setStudyyear] = useState(1);
  const [semesterDetail, setSemesterDetail] = useState('first');
  const [optional, setOptional] = useState(false);
  const [programmes, setProgrammes] = useState([]);
  const [title, setTitle] = useState();
  const { refetch, setRefetch } = useContext(AuthContext);
  const creditOptions = [
    {
      title: "7.5",
      value: "7.5",
    },
    {
      title: "15",
      value: "15",
    },
  ];

  const studyYear = [{ title: 1, value: 1 }, { title: 2, value: 2 }, { title: 3, value: 3 }]
  const semester = [{ title: 'First', value: 'first' }, { title: 'Second', value: 'second' }, { title: 'Whole Session', value: 'whole session' }]

  const [hoursData, setHoursData] = useState(timetabledHours);
  const [creditsData, setCreditsData] = useState(credits || 0);

  useEffect(() => {
    if (newValues) {
      setStudyyear(newValues?.studyYear)
      setSemesterDetail(newValues?.semester)
      setOptional(newValues?.optional)
      setProgrammes(newValues?.programme)
      setTitle(newValues?.title)
    }
  }, [])

  const makePayloadObject = (inputData) => {
    try {
      return {
        moduleCode: inputData.code,
        moduleCredit: parseInt(inputData.credits, 10),
        programme: programmes,
        studyYear: studyyear,
        semester: semesterDetail,
        title: title,
        optional: optional,
        timetabledHours: parseInt(inputData.timetabledHours, 10),
        lectures: parseInt(inputData.teachingsData.lectures, 10),
        seminars: parseInt(inputData.teachingsData.seminars, 10),
        tutorials: parseInt(inputData.teachingsData.tutorials, 10),
        labs: parseInt(inputData.teachingsData.labs, 10),
        fieldworkPlacement: parseInt(
          inputData.teachingsData.fieldwork_placement,
          10
        ),
        other: parseInt(inputData.teachingsData.other, 10),
        examPrep: {
          weightage: inputData.assessmentsData.examPrep.weightage,
          deadline: inputData.assessmentsData.examPrep.deadline,
        },
        courseworkPrep: inputData.assessmentsData.courseworkPrep.map(
          (item) => ({
            weightage: item.weightage,
            deadline: item.deadline,
          })
        ),
        classtestPrep: inputData.assessmentsData.classtestPrep.map((item) => ({
          weightage: item.weightage,
          deadline: item.deadline,
        })),
      };
    } catch (e) {
      console.log(e);
    }
  };

  const updateCourse = async (data) => {
    try {
      const response = await axios.put(
        `https://sweat-e00334d180ef.herokuapp.com/module/update/${moduleCode}`,
        data
      );
      if (response) {
        toast.success('Updated Successfully')
        setRefetch(refetch + 1)
        toggleModal();
      }
    } catch (e) {
      toast.error('Please fill all the required fields!')
    }
  };

  const saveData = () => {
    const data = {
      teachingsData: teachingsData,
      assessmentsData: assessmentsData,
      timetabledHours: hoursData,
      credits: creditsData,
      code: moduleCode,
    };
    updateCourse(makePayloadObject(data));
  };

  const handleSelectProgramme = (e) => {
    if (e.target.checked) {
      setProgrammes([...programmes, e.target.name]);
    } else {
      setProgrammes(programmes?.filter(programme => programme !== e.target.name));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <span className="close-btn" onClick={toggleModal}>
          &times;
        </span>

        <div className="inputContainer">
          <div>
            <div className="texti" style={{ color: "black" }}>Module Code</div>
            <div className="mutipleInput">
              <p>{moduleCode}</p>
            </div>
          </div>

          <div>
            <div className="texti" style={{ color: "black" }}>Module Credit</div>
            <div id="Credit" className="inputSize">
              <select
                name="credit"
                id="credit"
                value={creditsData}
                onChange={(e) => setCreditsData(e.target.value)}
              >
                {creditOptions?.map((option, index) => (
                  <option
                    value={option?.value}
                    defaultValue={creditOptions[0]?.value}
                    key={index}
                  >
                    {option.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="texti" style={{ color: "black" }}>TimeTabled Hours</div>
            <div id="timetable" className="inputSize">
              <Input
                onChange={(e) => setHoursData(e.target.value)}
                value={hoursData}
                placeholder={"Enter Timetabled Hours"}
                status={hours ? "" : "error"}
              />
            </div>
          </div>

          <div>
            <div className="texti" style={{ color: "black" }}>Title</div>
            <div className="mutipleInput">
              <Input
                onChange={(e) => setTitle(e.target.value)}
                placeholder={"Enter Module Code"}
                value={title}
                status={title ? "" : "error"}
              />
            </div>
          </div>
        </div>

        <div className="inputContainer">
          <div>
            <div className="texti" style={{ color: "black" }}>Study Year</div>
            <div id="Credit" className="inputSize">
              <select
                name="credit"
                className="select_field"
                value={studyyear}
                id="credit"
                onChange={(e) => setStudyyear(e.target.value)}
              >
                {studyYear?.map((option, index) => (
                  <option
                    value={option?.value}
                    defaultValue={creditOptions[0]?.value}
                    key={index}
                  >
                    {option.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="texti" style={{ color: 'black' }}>Programme</div>
            <div id="Programme" className="programme_checkboxes">
              <div>
                <label style={{ color: 'black' }}>
                  <input
                    name='CSEE'
                    type="checkbox"
                    checked={programmes.includes('CSEE')}
                    onChange={handleSelectProgramme}
                  />
                  CSEE
                </label>
                <label style={{ color: 'black' }}>
                  <input
                    name='AVS'
                    checked={programmes.includes('AVS')}
                    type="checkbox"
                    onChange={handleSelectProgramme}
                  />
                  AVS
                </label>
              </div>
              <div>
                <label style={{ color: 'black' }}>
                  <input
                    name='MCR'
                    checked={programmes.includes('MCR')}
                    type="checkbox"
                    onChange={handleSelectProgramme}
                  />
                  MCR
                </label>
                <label style={{ color: 'black' }}>
                  <input
                    name='EEE'
                    type="checkbox"
                    checked={programmes.includes('EEE')}
                    onChange={handleSelectProgramme}
                  />
                  EEE
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="texti" style={{ color: "black" }}>Semester</div>
            <div id="Semester" className="inputSize">
              <select
                name="Semester"
                id="semester"
                value={semesterDetail}
                className="select_field"
                onChange={(e) => setSemesterDetail(e.target.value)}
              >
                {semester?.map((option, index) => (
                  <option
                    value={option?.value}
                    defaultValue={creditOptions[0]?.value}
                    key={index}
                  >
                    {option.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="texti" style={{ color: "black" }}>Optional</div>
            <div id="Credit" className="inputSize">
              <select
                className="select_field"
                name="credit"
                id="credit"
                value={optional}
                onChange={(e) => setOptional(e.target.value)}
              >
                {[{ title: 'False', value: false }, { title: 'True', value: true }]?.map((option, index) => (
                  <option
                    value={option?.value}
                    defaultValue={creditOptions[0]?.value}
                    key={index}
                  >
                    {option.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>


        <div className="table-div">
          <DetailsTable hours={hours} setTeachingsData={setTeachingsData} newValues={newValues} hoursData={hoursData} />
        </div>
        <div style={{ marginTop: "20px" }}>
          <DetailsTable2
            data={secondTableData}
            setAssessmentsData={setAssessmentsData}
          />
        </div>
        <Button
          onClick={saveData}
          style={{
            color: "white",
            backgroundColor: "#b10062",
            fontWeight: "bold",
            // border: "2px solid #b10062",
            marginTop: "1rem",
            marginLeft: "80%",
          }}
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default DetailsModal;
