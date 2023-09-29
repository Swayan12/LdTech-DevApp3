import React, { useEffect } from 'react'
import { useState} from 'react';
import axios from 'axios';
import './Logfiles.css';


    const Logfiles = () => {
    const [logs, setLogs] = useState([])
    //connecting to frontend

    const GrafanaApi = 'http://13.234.23.179:3004/api/grafana';

    const fetchGrafana = async () => {
        try{
            const response = await axios.get(GrafanaApi);
            console.log(response)
            setLogs(response.data.data.result.map(item => 
                item.values.map(i => i)));
        }   catch(error){
            console.log('Error Fetching Api:', error);
        }

    };
   useEffect(()=>{
    fetchGrafana();
   })


    // search func for grafana
    const searchGrafana = () => {
    }

    //UI FOR GRAFANA
    //below are the functionalites of the page 
  return (
    <>
    <div className='grafana'>
    Logfiles
    <br/>
    <button className='grafana-btn1' onClick={fetchGrafana}>Refresh to get Logs</button>
    </div>
    <input className='grafana-inp1' type='search' placeholder='Enter to search' /> 
    <button className='grafana-btn2' onClick={searchGrafana}>Search</button> 
    <button className='grafana-btn1'>Filter/Sort By</button>
    <select className='grafana-inp' ></select>


    <ul>
        <div className='grafana-logs'>
            {logs.length > 0 && logs.map(item => 
        item.map(log =>  (<div className='grafana-card'><p>ID: {log[0]}</p> <br/> <p> details: {log[1]}</p> <br/></div>)))
            }

        </div>
    </ul>



    </>
  )
}

export default Logfiles;