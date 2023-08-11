import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from '../../../api/axios';
import { useDispatch } from 'react-redux';
import { getUserData } from '../../../redux/features/user/userDataSlice';

export default function SimpleLineChart(props) {

  const dispatch = useDispatch()

  const { days } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('user');
        if (!token) {
          dispatch(getUserData());
        } else {
          const res = (await axios.get("/statistics-data", {
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
    <div className="relative  overflow-hidden rounded-2xl flex justify-center pr-10 pt-8">
      <div className="absolute inset-0 blur-3xl" style={{ background: 'hsl(0deg 0% 100% / 100%)', boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.15)' }}></div>
      <div className="relative">
        <LineChart width={1028} height={500} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid stroke="gray" strokeDasharray="3 5" />
          <XAxis dataKey="name" stroke='#000' label={{ value: 'Date', position: 'insideBottomRight', dy: 40 }} tick={{ dy: 7 }} tickSize={12} />
          <YAxis stroke='#000' label={{ value: 'Number', angle: -90, position: 'insideLeft', dy: 20 }} tick={{ dx: -6 }} tickSize={10} />
          <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', borderRadius: '8px', border: '1px solid #444', color: '#fff', fontWeight: '500' }} />
          <Legend wrapperStyle={{ lineHeight: '60px', opacity: '100%', color: '#000' }} />
          {/* <Legend /> */}
          <Line type="monotone" dataKey="questions" stroke="#8884d8" strokeWidth='2' activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="answers" stroke="#82ca9d" strokeWidth='2' activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="comments" stroke="#ff7300" strokeWidth='2' activeDot={{ r: 5 }} />
        </LineChart>
      </div>
    </div>
  )
}