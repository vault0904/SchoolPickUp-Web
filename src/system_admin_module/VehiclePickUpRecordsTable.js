import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardBody, 
  Typography,  
  IconButton,
  Input,
  CardFooter,
  Button,
} from "@material-tailwind/react";
import '../css/defaultstyle.css';

export default function VehiclePickUpRecordsTable() {
  const TABLE_HEAD = ["VPU JOB ID", "JOB CREATED", "TIMESLOT", "JOB ASSIGNED", "JOB FINISHED", "DROPOFF REGION", "PARENT ID", "CHILD ID", "VEHICLE PLATE", "DRIVER ID", "SCHOOL ID", "STATUS"];

  const [vehiclePickUpRecordsTable, setVehiclePickUpRecordsTable] = useState([]);

  // Get all vehicle pick up records
  useEffect(() => {
    axios.get('https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/sysadm-getvehiclepickuprecords')
      .then(res => {
        if (res.data.success) {
          setVehiclePickUpRecordsTable(res.data.r)
        }
      })
      .catch(err => {
        console.error(err);
      })
  }, []);
  // console.log(vehiclePickUpRecordsTable)

  // Hooks for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 100;  // number of rows to display
  const startIndex = (currentPage - 1) * rowsPerPage;

  // Hook for search
  const [searchQuery, setSearchQuery] = useState('');

  return(
    <>
      <div className="flex justify-between items-center mb-4">
        <p 
          className="font-bold mr-auto text-lg"
          style={{ fontSize: '20px', color: '#56844B'}} >
          Vehicle Pick Up Records
        </p>        
      </div>

      {/* Search box */}       
      <div className='py-4'>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search jobcreated date | Example: 2023-08-09"
        />
      </div>
      
      <Card className="overflow-scroll h-full w-full">
        <CardBody style={{ padding: 0 }}>
          <table className="w-full min-w-max table-auto text-left">
            <thead className="bg-gray-200">
                <tr>
                  {TABLE_HEAD.map((head, idx) => (
                    <th key={`${head}-${idx}`} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        color="black"
                        className="font-normal leading-none opacity-80">
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehiclePickUpRecordsTable.length > 0 ? (
                  vehiclePickUpRecordsTable
                  .filter((row) => row.jobcreated.toLowerCase().includes(searchQuery.toLowerCase()))  // .filter for real time search query
                  .slice(startIndex, startIndex + rowsPerPage)  // .slice for pagination
                  .map(( data, index ) => {
                    const isLast = index === data.length - 1;
                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={data.vpu_Job_ID}>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {data.vpu_Job_ID}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {data.jobcreated}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {data.timeslot}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {(!data.jobassigned) ? (
                              "Pending"
                              ) : (
                              <>{data.jobassigned}</>
                            )}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {(!data.jobfinished) ? (
                              "Pending"
                              ) : (
                              <>{data.jobfinished}</>
                            )}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {data.dropoff_Region}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {data.parent_ID}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {data.child_ID}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {(!data.vehicle_Plate) ? (
                              "Pending"
                              ) : (
                              <>{data.vehicle_Plate}</>
                            )}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {(!data.driver_ID) ? (
                              "Pending"
                              ) : (
                              <>{data.driver_ID}</>
                            )}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {data.school_ID}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {data.status}
                          </Typography>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td className="p-4 text-center">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
          </table>
        </CardBody>

        {/* Pagination for table */}
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Button 
            variant="outlined" color="blue-gray" 
            size="sm" disabled={currentPage === 1} 
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from(Array(Math.ceil(vehiclePickUpRecordsTable.length / rowsPerPage)).keys()).map((page) => (
              <IconButton
                key={page + 1} variant={currentPage === page + 1 ? "outlined" : "text"}
                color="blue-gray" 
                size="sm"
                onClick={() => setCurrentPage(page + 1)}
              >
                {page + 1}
              </IconButton>
            ))}
          </div>
          <Button
            variant="outlined" color="blue-gray"
            size="sm" disabled={currentPage === Math.ceil(vehiclePickUpRecordsTable.length / rowsPerPage)}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}