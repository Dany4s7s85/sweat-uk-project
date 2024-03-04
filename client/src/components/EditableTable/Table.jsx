import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, ConfigProvider, Form, Input, Table } from "antd";
import { MdModeEditOutline } from "react-icons/md";
import { Tooltip } from "antd";
import { FaCheck } from "react-icons/fa";
import { toast } from 'react-toastify';
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
  const [editing, setEditing] = useState(editable || false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editable && editing) {
      inputRef?.current?.focus();
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
        <div>
          <Input
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            placeholder={"No of hours"}
          />
        </div>
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

const MyTable = (props) => {
  const [dataSource, setDataSource] = useState([
    {
      key: "0",
      lectures: "No of hours",
      seminars: "No of hours",
      tutorials: "No of hours",
      labs: "No of hours",
      fieldwork_placement: "No of hours",
      other: "No of hours",
    },
  ]);
  const [isEditable, setIsEditable] = useState(false);

  const defaultColumns = [
    {
      title: "Lectures",
      dataIndex: "lectures",
      editable: isEditable,
      required: true,
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
      dataIndex: "fieldwork_placement",
      width: '10%',
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
    const {
      fieldwork_placement,
      key,
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
    const numberValues = { fieldwork_placement, key, labs, lectures, other, tutorials, seminars }
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
    if (total !== parseInt(props?.hours)) {
      toast.error('Hours are not equal to the timetabled hours')
    } else {
      toast.success('Teaching data successfully saved')
      props?.setError(false);
      props?.setTeachingData({ ...dataSource[0], bypassValues });
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
        editable: col?.editable,
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
        danger={props?.error}
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
export default MyTable;
