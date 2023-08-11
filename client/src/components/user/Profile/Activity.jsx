import React, { useEffect, useState } from 'react'
import SimpleLineChart from './SimpleLineChart';

export default function Activity() {
    const [days, setDays] = useState(10);

    useEffect(() => {
        console.log("We are at Activity component");
    }, [])

    return (
        <div className=''>
            <div className='text-2xl capitalize font-semibold pb-5'>My Activity</div>
            <div className='flex flex-row justify-between rounded-3xl'>                 {/* Activity */}
                <div className="flex justify-center items-center">
                    <div className="absolute z-10 right-[440px] text-white flex flex-col gap-10 ml-auto">
                        <button className={`${days == 10 ? 'bg-black text-white' : 'bg-[#757575] hover:bg-black hover:text-white'} py-1 px-1.5 rounded-md font-medium`} onClick={() => setDays(10)}>10</button>
                        <button className={`${days == 30 ? 'bg-black text-white' : 'bg-[#757575] hover:bg-black hover:text-white'} py-1 px-1.5 rounded-md font-medium`} onClick={() => setDays(30)}>30</button>
                        <button className={`${days == 60 ? 'bg-black text-white' : 'bg-[#757575] hover:bg-black hover:text-white'} py-1 px-1.5 rounded-md font-medium`} onClick={() => setDays(60)}>60</button>
                        <button className={`${days == 100 ? 'bg-black text-white' : 'bg-[#757575] hover:bg-black hover:text-white'} py-1 px-1.5 rounded-md font-medium`} onClick={() => setDays(100)}>All</button>
                    </div>
                    <div className="relative z-0">
                        <SimpleLineChart days={days} />
                    </div>
                </div>
            </div>
        </div>
    )
}

