import { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { useLocalStorage } from "usehooks-ts";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';

export default function Schedule() {
  const [keyOptions, setKeyOptions] =
    useLocalStorage("keyOptions", [
      "--ceph",
      "--ceph-repo",
      "--suite-repo",
      "--suite-branch",
      "--suite",
      "--subset",
      "--machine",
      "--filter",
      "--distro",
      "--rerun",
      "--rerun-statuses",
      "--limit",
      "--priority",
      "--force-priority"
    ]);

  const [rowData, setRowData] = useLocalStorage("rowData", []);
  const [rowIndex, setRowIndex] = useLocalStorage("rowIndex", -1);
  const [commandBarContent, setCommandBarContent] = useState([]);

  useEffect(() => {
    setCommandBarContent(rowData);
  }, [rowData]
  );

  const handleRun = () => {
    return false;
  };

  const handleDryRun = () => {
    return false;
  };

  const addNewRow = () => {
    console.log("addNewRow");
    const updatedRowIndex = rowIndex + 1;
    setRowIndex(updatedRowIndex);
    const index = (updatedRowIndex % keyOptions.length);
    console.log(index);
    const object = {
      key: keyOptions[index],
      value: "",
      lock: false,
      checked: true,
    }
    const updatedRowData = [...rowData];
    updatedRowData.push(object);
    setRowData(updatedRowData);
  };

  const handleCheckboxChange = (index, event) => {
    console.log("handleCheckboxChange");
    const newRowData = [...rowData];
    if (event.target.checked) {
      newRowData[index].checked = true;
    } else {
      newRowData[index].checked = false;
    }
    setRowData(newRowData);
  };

  const handleKeySelectChange = (index, event) => {
    console.log("handleKeySelectChange");
    const newRowData = [...rowData];
    newRowData[index].key = event.target.value;
    setRowData(newRowData);

  };

  const handleValueChange = (index, event) => {
    console.log("handleValueChange");
    const newRowData = [...rowData];
    newRowData[index].value = event.target.value;
    setRowData(newRowData);
  };

  const handleDeleteRow = (index) => {
    console.log("handleDeleteRow");
    let newRowData = [...rowData];
    newRowData.splice(index, 1)
    console.log(newRowData);
    setRowData(newRowData);
    const updatedRowIndex = rowIndex - 1;
    setRowIndex(updatedRowIndex);
  };

  const toggleRowLock = (index) => {
    console.log("toggleRowLock");
    const newRowData = [...rowData];
    newRowData[index].lock = !newRowData[index].lock;
    setRowData(newRowData);
  };

  return (
    <div>
      <Helmet>
        <title>Schedule - Pulpito</title>
      </Helmet>
      <Typography variant="h5" style={{ paddingBottom: "20px" }}>
        Schedule a run
      </Typography>
      <div style={{ border: "#b4bfa6", display: "flex", paddingBottom: "20px" }}>
        <TextField // Command Bar
          variant="outlined"
          style={{ width: "100%", height: "50px" }}
          value={`teuthology-suite ${commandBarContent.map((data, index) => {
            if (data.checked) {
              return `${data.key} ${data.value}`;
            }
          })
            .join(" ")}`}
          placeholder="teuthology-suite"
          disabled={true}
        />
        <div style={{ display: "flex", paddingLeft: "20px" }}>
          <Button
            style={{ height: "50px", width: "100px" }}
            variant="contained"
            color="error"
            onClick={handleRun}
          >
            Run
          </Button>
          <Button
            style={{ height: "50px", width: "100px", backgroundColor: "#1976D2", color: "#fff", marginLeft: "20px" }}
            variant="contained"
            onClick={handleDryRun}
          >
            Dry Run
          </Button>
        </div>
      </div>
      <div style={{ paddingBottom: "20px" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left"></TableCell>
                <TableCell align="left">Key</TableCell>
                <TableCell align="left">Value</TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            {<TableBody>
              {rowData.map((data, index) => (
                <TableRow
                  hover={true}
                >
                  <TableCell>
                    <Checkbox
                      style={{ transform: "scale(1.2)" }}
                      type="checkbox"
                      id={`checkbox${index + 1}`}
                      checked={data.checked}
                      onChange={(event) => handleCheckboxChange(index, event)} />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={data.key}
                      onChange={(event) => handleKeySelectChange(index, event)}
                      disabled={data.lock}
                      size="small"
                    >
                      {keyOptions.map((option, optionIndex) => (
                        <MenuItem
                          value={option}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      size="small"
                      value={data.value}
                      onChange={(event) => handleValueChange(index, event)}
                      disabled={data.lock}
                    />
                  </TableCell>
                  <TableCell>
                    <div style={{ display: "flex" }}>
                      <div
                        style={{ cursor: "pointer", color: "#888" }}
                        onClick={() => toggleRowLock(index)}
                      >
                        {data.lock ? <LockIcon /> : <LockOpenIcon />}
                      </div>
                      <div
                        style={{ cursor: "pointer", color: "#888" }}
                        onClick={() => {
                          handleDeleteRow(index);
                        }}
                      >
                        <DeleteIcon />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>}
          </Table>
        </TableContainer>
      </div>
      <Fab
        disabled={!keyOptions.length}
        style={{ backgroundColor: "#1976D2", color: "#fff", float: "right" }}
        onClick={addNewRow}>
        <AddIcon
        >
        </AddIcon>
      </Fab >
    </div >
  );
}
