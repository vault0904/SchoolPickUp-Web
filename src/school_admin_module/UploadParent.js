import React from 'react'
import Papa from 'papaparse'
import {
  CButton,
  CContainer,
  CFormInput,
} from '@coreui/react'
import { useState } from 'react'
import { Card, CardHeader, Typography } from '@material-tailwind/react';
import '../css/defaultstyle.css'
import axios from 'axios';

export default function UploadParent() {
  // PREVIEW START //
  const [tableVisible, setTableVisible] = useState(false)
  const handlePreview = () => {
    setTableVisible(!tableVisible)
  }
  // PREVIEW END //

  //  UPLOAD FUNCTION START  //
  // States to store csv data
  const [ data, setData ] = useState([]);
  const [ column, setColumn ] = useState([]);
  const [ value, setValue ] = useState([]);
  const [ numberOfRows, setNumberOfRows ] = useState('');

  const handleCSV = (e) => {
    Papa.parse(e.target.files[0], 
      {
        header: true,
        skipEmptyLines: true,
        complete: function(result) {
          const column = [];
          const value = [];
          result.data.forEach((d) => {
            // Check if all required values are present in the row
            const keys = Object.keys(d);
            const values = Object.values(d);
            const allValuesPresent = values.every((val) => val !== undefined && val !== "");  // check if value is either empty string or undefined
            
            // Only process rows that have complete values
            if (allValuesPresent) {
              column.push(keys);
              value.push(values);
            }
          });

          setData(result.data);
          setColumn(column[0]);

          // To see number of rows uploaded
          setValue(value);
          setNumberOfRows(value.length) 
        }
      }
    )
  }

  const handleSubmit = async () => {
      if (data.length == 0) {
        alert('Upload csv file first')
      } else {
        // First validation, check if user submitted csv file with correct headers 
        const expectedHeader = ['parentid', 'password', 'firstname', 'lastname', 'email', 'address', 'contactno'];
        // check if correct number of headers
        if (column.length !== expectedHeader.length) {
          alert('CSV file has incorrect number of headers. Please check the columns');
          return;
        }
        // check if correct name for headers
        const isHeaderCorrect = column.every((col, index) => col === expectedHeader[index]);
        if (!isHeaderCorrect) {
          alert('CSV file has incorrect headers. Please check the column order and spellings.');
          return;
        }
        // Second validation
        // Validate, check if userid already exists
        const schoolid = localStorage.getItem('schoolid');
        const subscription = 'Normal';  // Default subscription status for parents is normal when account is first created
        const submittedParentIds = data.map((item) => item.parentid);

        axios.post('https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/schadm-uploadparentvalidation', {
          spi: submittedParentIds,
        })
        .then(firstCheckRes=> {
          if(firstCheckRes.data.success) {
            // Passed validation, proceed to upload Parent details into DB
            axios.post('https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/schadm-uploadparent', {
              data: data,
              s: subscription,
              si: schoolid
            })
            .then(uploadRes=>{
              if (uploadRes.data.success) {
                alert('Parent details uploaded successfully. Check the Parent tab')
              } else {
                alert(uploadRes.data.errlog)
              }
            })
          } else {
            alert(firstCheckRes.data.errlog)
          }
        })
      }
  }
  //  UPLOAD FUNCTION END //

  return (
    <>
      <CContainer 
        className='px-5 py-4 pb-5' 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h1 
          style={{ color: '#56844B', fontWeight: 'bold', marginBottom: '25px', fontSize: '20px'}}>
          Upload Parent Details
        </h1>
        <CFormInput 
          type="file" 
          id="formFile"
          accept=".csv"
          onChange={handleCSV}
          className='w-50'/>

          <div style={{marginTop: '40px', display: 'flex', justifyContent: 'space-between'}} className='w-50'>
            <CButton 
              onClick={handlePreview}
              style ={{'background': '#56844B', width: '45%'}}
              >
              Preview
            </CButton>
            <CButton 
              onClick={handleSubmit}
              style ={{'background': '#56844B', width: '45%'}}
              >
              Submit
            </CButton>
          </div>
      </CContainer>

      <CContainer className='px-4 py-2 pb-5'>
        {data.length == 0 ? '' : 
          <Typography className="px-5">
            Number of parent data registered after upload: {numberOfRows}
          </Typography>
        }

        <Typography className="px-5 pb-5">
          Notice: Any row(s) in the CSV that have empty values will be skipped 
        </Typography>

        <CardHeader color="blue-gray" className="pb-2">
          <img
            src=""  // link the png from assets here
            alt="Parent CSV sample image"
          />
        </CardHeader>
        
        {/* Preview table */}
        {tableVisible && (
        <div className='pt-5'>
          <Card className="h-full w-full overflow-scroll">
            <table className="w-full min-w-max table-auto text-left">
              <tbody>
                {data.map(({ parentid, password, firstname, lastname, email, address, contactno }, index) => (
                  <tr key={parentid} className="even:bg-blue-gray-50/50">
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {parentid}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {password}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {firstname}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {lastname}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {email}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {address}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {contactno}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
        )}
      </CContainer>
    </>
  )
}