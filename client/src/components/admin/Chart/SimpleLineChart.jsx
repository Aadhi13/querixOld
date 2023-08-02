import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from '../../../api/axios';

// const datad = [
//   {
//     name: '01/07/2023',
//     questions: 10,
//     answers: 23,
//   },
//   {
//     name: '02/07/2023',
//     questions: 0,
//     answers: 4,
//   },
//   {
//     name: '03/07/2023',
//     questions: 14,
//     answers: 5,
//   },
//   {
//     name: '04/07/2023',
//     questions: 4,
//     answers: 0,
//   },
//   {
//     name: '05/07/2023',
//     questions: 29,
//     answers: 24,
//   },
//   {
//     name: '06/07/2023',
//     questions: 2,
//     answers: 29,
//   },
//   {
//     name: '07/07/2023',
//     questions: 4,
//     answers: 12,
//   },
// ];


export default function SimpleLineChart(props) {
  const { days } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('admin');
        if (!token) {
          dispatch(getAdminData());
        } else {
          console.log(token, 'toekn');
          const res = (await axios.get("/admin/statistics-data", {
            params: { days },
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            withCredentials: true,
          }));
          setData(res.data.data)
        }
      } catch (err) {
        console.log(err.res);
      }
    };
    fetchData();
  }, [days])

  return (
    <div className="text-white relative w-[900px] overflow-hidden rounded-2xl flex justify-center pr-10 pt-8">
      <div className="absolute inset-0 blur-3xl" style={{ background: 'hsl(0deg 0% 100% / 13%)', boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.3)' }}></div>
      <div className="relative">
        <LineChart width={800} height={500} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid stroke="gray" strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke='#ccc' label={{ value: 'Date', position: 'insideBottomRight', dy: 40 }} tick={{ dy: 7 }} tickSize={12} />
          <YAxis stroke='#ccc' label={{ value: 'Number', angle: -90, position: 'insideLeft', dy: 20 }} tick={{ dx: -6 }} tickSize={10} />
          <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: '8px', border: '1px solid #444', color: '#ccc', fontWeight: '500' }} />
          <Legend wrapperStyle={{ lineHeight: '60px' }} />
          {/* <Legend /> */}
          <Line type="monotone" dataKey="questions" stroke="#8884d8" strokeWidth='2' activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="answers" stroke="#82ca9d" strokeWidth='2' activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="comments" stroke="#ff7300" strokeWidth='2' activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="users" stroke="#ffc107" strokeWidth='2' activeDot={{ r: 5 }} />
        </LineChart>
      </div>
    </div>
  )
}