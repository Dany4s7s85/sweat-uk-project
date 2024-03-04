import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, ConfigProvider, Form, Input, Table, Tooltip } from "antd";
import { MdModeEditOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { toast } from 'react-toastify'

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
const DetailsTable = ({ hours, newValues, hoursData }) => {
  const rowData = { ...hours, ...newValues }
  const [dataSource, setDataSource] = useState([rowData]);
  const [isEditable, setIsEditable] = useState(false);
  const defaultColumns = [
    {
      title: "Lectures",
      dataIndex: "lectures",
      editable: isEditable,
      render: (text) => <p style={{ color: "white" }}>{text}</p>,
    },
    {
      title: "Seminars",
      dataIndex: "seminars",
      editable: isEditable,
      render: (text) => <p style={{ color: "white" }}>{text}</p>,
    },
    {
      title: "Tutorials",
      dataIndex: "tutorials",
      editable: isEditable,
      render: (text) => <p style={{ color: "white" }}>{text}</p>,
    },
    {
      title: "Labs",
      dataIndex: "labs",
      editable: isEditable,
      render: (text) => <p style={{ color: "white" }}>{text}</p>,
    },
    {
      title: "Fieldwork Placement",
      dataIndex: "fieldworkPlacement",
      width: "8%",
      editable: isEditable,
      render: (text) => <p style={{ color: "white" }}>{text}</p>,
    },
    {
      title: "Other",
      dataIndex: "other",
      editable: isEditable,
      render: (text) => <p style={{ color: "white" }}>{text}</p>,
    },
    {
      title: "Edit",
      dataIndex: "operation",
      render: (_) =>
        dataSource.length >= 1 ? (
          <div style={{ display: "flex", gap: "10px" }}>
            <p
              onClick={() => setIsEditable(!isEditable)}
              style={{
                color: "white",
                cursor: "pointer",
                title: "Edit Schedule",
              }}
            >
              <Tooltip title={!isEditable ? "Edit" : "Save"}>
                {!isEditable ? <MdModeEditOutline /> : <FaCheck />}
              </Tooltip>
            </p>
          </div>
        ) : null,
    },
  ];

  const onSave = () => {
    let {
      fieldworkPlacement,
      labs,
      lectures,
      other,
      programme,
      semester,
      seminars,
      tutorials,
      studyYear,
      title
    } = dataSource[0]
    const bypassValues = { programme, semester, studyYear, title }
    const numberValues = { fieldworkPlacement, labs, lectures, other, tutorials, seminars }
    const areAllValuesNumbers = Object.values(numberValues).every(
      (value) => !isNaN(value)
    );
    if (!areAllValuesNumbers) {
      toast.error('No of hours required for all fields. Please enter valid numbers')
      return;
    }
    const total = Object.values(numberValues)
      .filter((value) => !isNaN(value))
      .reduce((acc, value) => acc + parseFloat(value), 0);
    if (total !== parseInt(hoursData)) {
      toast.error('Hours are not equal to the timetabled hours')
    } else {
      toast.success('Data Saved Successfully')
      setTeachingsData({ ...numberValues, ...bypassValues });
    }
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
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
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          pagination={false}
          dataSource={dataSource}
          columns={columns}
        />
      </ConfigProvider>
      <Button
        onClick={onSave}
        style={{
          color: "#051650",
          backgroundColor: "white",
          fontWeight: "bold",
          border: "2px solid #b10062",
          marginTop: "1rem",
        }}
      >
        Save
      </Button>
    </div>
  );
};
export default DetailsTable;
