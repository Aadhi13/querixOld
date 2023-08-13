export function Info(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M11 17h2v-6h-2Zm1-8q.425 0 .713-.288Q13 8.425 13 8t-.287-.713Q12.425 7 12 7t-.712.287Q11 7.575 11 8t.288.712Q11.575 9 12 9Zm0 13q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z"></path></svg>
  )
}


export function Check(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m10.6 16.6l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z"></path></svg>
  )
}


export function Cross(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M19.1 4.9C15.2 1 8.8 1 4.9 4.9S1 15.2 4.9 19.1s10.2 3.9 14.1 0s4-10.3.1-14.2zm-4.3 11.3L12 13.4l-2.8 2.8l-1.4-1.4l2.8-2.8l-2.8-2.8l1.4-1.4l2.8 2.8l2.8-2.8l1.4 1.4l-2.8 2.8l2.8 2.8l-1.4 1.4z"></path></svg>
  )
}


export function UpVote(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M0 0h24v24H0z"></path><path fill="currentColor" d="M11.99 1.968c1.023 0 1.97.521 2.512 1.359l.103.172l7.1 12.25l.062.126a3 3 0 0 1-2.568 4.117L19 20H5l-.049-.003l-.112.002a3 3 0 0 1-2.268-1.226l-.109-.16a3 3 0 0 1-.32-2.545l.072-.194l.06-.125L9.366 3.516a3 3 0 0 1 2.625-1.548z"></path></g></svg>
  )
}


export function DownVote(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M0 0h24v24H0z"></path><path fill="currentColor" d="M19.007 3a3 3 0 0 1 2.828 3.94l-.068.185l-.062.126l-7.09 12.233a3 3 0 0 1-5.137.19l-.103-.173l-7.1-12.25l-.061-.125a3 3 0 0 1 2.625-4.125L4.897 3l.06.002L5 3h14.007z"></path></g></svg>
  )
}


export function DropDown(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m12 15l-4.243-4.242l1.415-1.414L12 12.172l2.828-2.828l1.415 1.414L12 15.001Z"></path></svg>
  )
}



export function Media(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M2 6H0v5h.01L0 20c0 1.1.9 2 2 2h18v-2H2V6zm5 9h14l-3.5-4.5l-2.5 3.01L11.5 9zM22 4h-8l-2-2H6c-1.1 0-1.99.9-1.99 2L4 16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 12H6V4h5.17l1.41 1.41l.59.59H22v10z"></path></svg>
  )
}

export function SpinningWheel(props) {
  return (
    <div className="flex-col flex-1 transition-opacity duration-500 overflow-hidden">
      <div className="flex flex-col gap-2 pb-2 text-black text-sm h-full justify-center items-center"><svg
        stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"
        strokeLinejoin="round" className="animate-spin text-center m-auto" {...props}
        xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="2" x2="12" y2="6"></line>
        <line x1="12" y1="18" x2="12" y2="22"></line>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
        <line x1="2" y1="12" x2="6" y2="12"></line>
        <line x1="18" y1="12" x2="22" y2="12"></line>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
      </svg></div>
    </div>
  )
};

export function Flag(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M6 21q-.425 0-.713-.288T5 20V5q0-.425.288-.713T6 4h7.175q.35 0 .625.225t.35.575L14.4 6H19q.425 0 .713.288T20 7v8q0 .425-.288.713T19 16h-5.175q-.35 0-.625-.225t-.35-.575L12.6 14H7v6q0 .425-.288.713T6 21Zm6.5-11Zm2.15 4H18V8h-5.25l-.4-2H7v6h7.25l.4 2Z"></path>
    </svg>
  )
};

export function Save(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M5 21V5q0-.825.588-1.413T7 3h10q.825 0 1.413.588T19 5v16l-7-3l-7 3Zm2-3.05l5-2.15l5 2.15V5H7v12.95ZM7 5h10H7Z"></path>
    </svg>
  )
};

export function Saved(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M5 21V5q0-.825.588-1.413T7 3h10q.825 0 1.413.588T19 5v16l-7-3l-7 3Z"></path></svg>
  )
}

export function Share(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M12 16q-.425 0-.713-.288T11 15V4.825l-.9.9Q9.825 6 9.412 6T8.7 5.7q-.275-.3-.275-.713T8.7 4.3l2.6-2.6q.125-.125.313-.2T12 1.425q.2 0 .388.075t.312.2l2.6 2.6q.3.3.3.725t-.3.7Q15 6 14.587 6t-.687-.275l-.9-.9V15q0 .425-.288.713T12 16Zm-6 7q-.825 0-1.413-.588T4 21V10q0-.825.588-1.413T6 8h2q.425 0 .713.288T9 9q0 .425-.288.713T8 10H6v11h12V10h-2q-.425 0-.713-.288T15 9q0-.425.288-.713T16 8h2q.825 0 1.413.588T20 10v11q0 .825-.588 1.413T18 23H6Z"></path>
    </svg>
  )
}

export function Close(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="m8.4 17l3.6-3.6l3.6 3.6l1.4-1.4l-3.6-3.6L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4l3.6 3.6L7 15.6L8.4 17Zm3.6 5q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm0-8Z"></path>
    </svg>
  )
}

export function Open(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h6q.425 0 .713.288T12 4q0 .425-.288.713T11 5H5v14h14v-6q0-.425.288-.713T20 12q.425 0 .713.288T21 13v6q0 .825-.588 1.413T19 21H5Zm4-6q-.275-.275-.275-.7T9 13.6L17.6 5H15q-.425 0-.713-.288T14 4q0-.425.288-.713T15 3h5q.425 0 .713.288T21 4v5q0 .425-.288.713T20 10q-.425 0-.713-.288T19 9V6.4l-8.625 8.625q-.275.275-.675.275T9 15Z"></path>
    </svg>
  )
}

export function Pending(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M17 22q-2.075 0-3.538-1.463T12 17q0-2.075 1.463-3.538T17 12q2.075 0 3.538 1.463T22 17q0 2.075-1.463 3.538T17 22Zm.5-5.2v-2.3q0-.2-.15-.35T17 14q-.2 0-.35.15t-.15.35v2.275q0 .2.075.388t.225.337l1.525 1.525q.15.15.35.15t.35-.15q.15-.15.15-.35t-.15-.35L17.5 16.8ZM5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h4.175q.275-.875 1.075-1.438T12 1q1 0 1.788.563T14.85 3H19q.825 0 1.413.588T21 5v6.25q-.45-.325-.95-.55T19 10.3V5h-2v2q0 .425-.288.713T16 8H8q-.425 0-.713-.288T7 7V5H5v14h5.3q.175.55.4 1.05t.55.95H5Zm7-16q.425 0 .713-.288T13 4q0-.425-.288-.713T12 3q-.425 0-.713.288T11 4q0 .425.288.713T12 5Z"></path>
    </svg>
  )
}

export function FactCheck(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M4 21q-.825 0-1.413-.588T2 19V5q0-.825.588-1.413T4 3h16q.825 0 1.413.588T22 5v14q0 .825-.588 1.413T20 21H4Zm0-2h16V5H4v14Zm5-2q.425 0 .713-.288T10 16q0-.425-.288-.713T9 15H6q-.425 0-.713.288T5 16q0 .425.288.713T6 17h3Zm5.55-4.825l-.725-.725q-.3-.3-.7-.287t-.7.312q-.275.3-.288.7t.288.7L13.85 14.3q.3.3.7.3t.7-.3l3.55-3.55q.3-.3.3-.7t-.3-.7q-.3-.3-.713-.3t-.712.3l-2.825 2.825ZM9 13q.425 0 .713-.288T10 12q0-.425-.288-.713T9 11H6q-.425 0-.713.288T5 12q0 .425.288.713T6 13h3Zm0-4q.425 0 .713-.288T10 8q0-.425-.288-.713T9 7H6q-.425 0-.713.288T5 8q0 .425.288.713T6 9h3ZM4 19V5v14Z"></path>
    </svg>
  )
}

export function Block(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-1.35-.438-2.6T18.3 7.1L7.1 18.3q1.05.825 2.3 1.263T12 20Zm-6.3-3.1L16.9 5.7q-1.05-.825-2.3-1.262T12 4Q8.65 4 6.325 6.325T4 12q0 1.35.437 2.6T5.7 16.9Z"></path>
    </svg>
  )
}

export function Public(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm-1-2.05V18q-.825 0-1.413-.588T9 16v-1l-4.8-4.8q-.075.45-.138.9T4 12q0 3.025 1.988 5.3T11 19.95Zm6.9-2.55q.5-.55.9-1.188t.662-1.325q.263-.687.4-1.412T20 12q0-2.45-1.363-4.475T15 4.6V5q0 .825-.588 1.413T13 7h-2v2q0 .425-.288.713T10 10H8v2h6q.425 0 .713.288T15 13v3h1q.65 0 1.175.388T17.9 17.4Z"></path>
    </svg>
  )
}

export function PublicOff(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m20.475 23.3l-2.95-2.95q-1.2.8-2.587 1.225T12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-1.55.425-2.938T3.65 6.476L.675 3.5L2.1 2.075l19.8 19.8l-1.425 1.425ZM11 19.95V18q-.825 0-1.413-.587T9 16v-1l-4.8-4.8q-.075.45-.138.9T4 12q0 3.025 1.988 5.3T11 19.95Zm9.35-2.475l-1.45-1.45q.525-.925.813-1.937T20 12q0-2.45-1.363-4.475T15 4.6V5q0 .825-.588 1.413T13 7h-2v1.125L6.525 3.65q1.2-.775 2.575-1.212T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 1.525-.438 2.9t-1.212 2.575Z"></path></svg>
  )
}

export function Account(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M5.85 17.1q1.275-.975 2.85-1.538T12 15q1.725 0 3.3.563t2.85 1.537q.875-1.025 1.363-2.325T20 12q0-3.325-2.337-5.663T12 4Q8.675 4 6.337 6.337T4 12q0 1.475.488 2.775T5.85 17.1ZM12 13q-1.475 0-2.488-1.012T8.5 9.5q0-1.475 1.012-2.488T12 6q1.475 0 2.488 1.012T15.5 9.5q0 1.475-1.012 2.488T12 13Zm0 9q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"></path></svg>
  )
}

export function Edit(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M5 23.7q-.825 0-1.413-.587T3 21.7v-14q0-.825.588-1.413T5 5.7h8.925l-2 2H5v14h14v-6.95l2-2v8.95q0 .825-.588 1.413T19 23.7H5Zm7-9Zm4.175-8.425l1.425 1.4l-6.6 6.6V15.7h1.4l6.625-6.625l1.425 1.4l-6.625 6.625q-.275.275-.638.438t-.762.162H10q-.425 0-.713-.288T9 16.7v-2.425q0-.4.15-.763t.425-.637l6.6-6.6Zm4.275 4.2l-4.275-4.2l2.5-2.5q.6-.6 1.438-.6t1.412.6l1.4 1.425q.575.575.575 1.4T22.925 8l-2.475 2.475Z"></path></svg>
  )
}

export function Text(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M5 19h14V9.825L14.175 5H5v14Zm0 2q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h9.175q.4 0 .763.15t.637.425l4.85 4.85q.275.275.425.638t.15.762V19q0 .825-.588 1.413T19 21H5Zm3-4h8q.425 0 .713-.288T17 16q0-.425-.288-.713T16 15H8q-.425 0-.713.288T7 16q0 .425.288.713T8 17Zm0-4h8q.425 0 .713-.288T17 12q0-.425-.288-.713T16 11H8q-.425 0-.713.288T7 12q0 .425.288.713T8 13Zm0-4h5q.425 0 .713-.288T14 8q0-.425-.288-.713T13 7H8q-.425 0-.713.288T7 8q0 .425.288.713T8 9ZM5 19V5v14Z"></path></svg>
  )
}

export function Comment(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M6 14h12v-2H6v2Zm0-3h12V9H6v2Zm0-3h12V6H6v2Zm16 14l-4-4H4q-.825 0-1.413-.588T2 16V4q0-.825.588-1.413T4 2h16q.825 0 1.413.588T22 4v18ZM4 16V4v12Zm14.85 0L20 17.125V4H4v12h14.85Z"></path></svg>
  )
}

export function Vote(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M16 12.675q-.175 0-.338-.05t-.287-.175q-2.15-1.95-3.763-3.763T10 5.3q0-1.4.95-2.35T13.3 2q.8 0 1.5.338t1.2.912q.5-.575 1.2-.912T18.7 2q1.4 0 2.35.95T22 5.3q0 1.575-1.613 3.388t-3.762 3.762q-.125.125-.288.175t-.337.05Zm0-2.375q1.475-1.4 2.738-2.788T20 5.3q0-.575-.363-.937T18.7 4q-.35 0-.663.138t-.537.412L16 6.35l-1.5-1.8q-.225-.275-.537-.413T13.3 4q-.575 0-.938.363T12 5.3q0 .825 1.263 2.213T16 10.3Zm-2.05 10.1l5.95-1.85q-.125-.225-.363-.388T19 18h-5.05q-.675 0-1.075-.05t-.825-.2l-1.425-.475q-.4-.125-.575-.5T10 16q.125-.4.488-.588t.762-.062l1.05.35q.425.125.963.2t1.462.1H15q0-.275-.162-.525t-.388-.325L8.6 13H7v5.5l6.95 1.9Zm-.525 1.95L7 20.55q-.2.65-.788 1.05T5 22H3q-.825 0-1.413-.588T1 20v-7q0-.825.588-1.413T3 11h5.6q.175 0 .35.038t.325.087L15.15 13.3q.825.3 1.338 1.05T17 16h2q1.25 0 2.125.825T22 19q0 .55-.288.863t-.887.512l-6.25 1.95q-.275.1-.575.1t-.575-.075ZM16 7.15ZM3 20h2v-7H3v7Z"></path></svg>
  )
}

export function Article(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M8 17h5q.425 0 .713-.288T14 16q0-.425-.288-.713T13 15H8q-.425 0-.713.288T7 16q0 .425.288.713T8 17Zm0-4h8q.425 0 .713-.288T17 12q0-.425-.288-.713T16 11H8q-.425 0-.713.288T7 12q0 .425.288.713T8 13Zm0-4h8q.425 0 .713-.288T17 8q0-.425-.288-.713T16 7H8q-.425 0-.713.288T7 8q0 .425.288.713T8 9ZM5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Zm0-2h14V5H5v14ZM5 5v14V5Z"></path></svg>
  )
}

export function Delete(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M7 21q-.825 0-1.413-.588T5 19V6q-.425 0-.713-.288T4 5q0-.425.288-.713T5 4h4q0-.425.288-.713T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5q0 .425-.288.713T19 6v13q0 .825-.588 1.413T17 21H7ZM7 6v13h10V6H7Zm2 10q0 .425.288.713T10 17q.425 0 .713-.288T11 16V9q0-.425-.288-.713T10 8q-.425 0-.713.288T9 9v7Zm4 0q0 .425.288.713T14 17q.425 0 .713-.288T15 16V9q0-.425-.288-.713T14 8q-.425 0-.713.288T13 9v7ZM7 6v13V6Z"></path></svg>
  )
}

export function SaveSubmit(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h11.175q.4 0 .763.15t.637.425l2.85 2.85q.275.275.425.638t.15.762V19q0 .825-.588 1.413T19 21H5ZM19 7.85L16.15 5H5v14h14V7.85ZM12 18q1.25 0 2.125-.875T15 15q0-1.25-.875-2.125T12 12q-1.25 0-2.125.875T9 15q0 1.25.875 2.125T12 18Zm-5-8h7q.425 0 .713-.288T15 9V7q0-.425-.288-.713T14 6H7q-.425 0-.713.288T6 7v2q0 .425.288.713T7 10ZM5 7.85V19V5v2.85Z"></path></svg>
  )
}

export function Cancel(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m12 13.4l2.9 2.9q.275.275.7.275t.7-.275q.275-.275.275-.7t-.275-.7L13.4 12l2.9-2.9q.275-.275.275-.7t-.275-.7q-.275-.275-.7-.275t-.7.275L12 10.6L9.1 7.7q-.275-.275-.7-.275t-.7.275q-.275.275-.275.7t.275.7l2.9 2.9l-2.9 2.9q-.275.275-.275.7t.275.7q.275.275.7.275t.7-.275l2.9-2.9Zm0 8.6q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm0-8Z"></path></svg>
  )
}

export function PlaceholderUser() {
  return (
    <div className='p-2 flex flex-col items-center'>
      <div className='flex justify-center items-center rounded-full bg-profileBtBg w-12 h-12 overflow-hidden'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-profileBt w-11 h-11 mt-4">
          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  )
}