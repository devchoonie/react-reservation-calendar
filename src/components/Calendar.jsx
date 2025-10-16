import { useEffect, useState, useRef } from "react";
import data from "./calendar.json";
import Day from "./Day";


/** 
이 커스텀 훅은 모든 상태값을 가지고 컨트롤, This custom hook controls and manages all state values
*/
function useGetDay(){

    const [ym, setYm] = useState({ year: null, month: null, totalDays:null, calendarArray:null, totalCells:35});
    const [selectedStart ,setSelectedStart] = useState({year:null, month:null, day:null});
    const selectDayRef = useRef({start:{year:null, month:null, day:null, room:null}, end:{year:null, month:null, day:null, roomId:null}, roomId:null});
    
    // function
    /** 이전 달, 다음 달 버튼 클릭 시 호출하는 함수, A function that is called when the previous or next month button is clicked */
    const moveMonth = ({type}) => {
        
        if (type === "pre") {

          const tempDate = new Date(ym.year, ym.month - 1);
          const [numberOfDay] =  getStartDay(tempDate);
          const tempDateDays = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0);
          const [calendar, totalCells] = generateCalendarData(tempDate.getFullYear(), tempDate.getMonth(), tempDateDays.getDate(), numberOfDay);
          setYm({ year: tempDate.getFullYear(), month: tempDate.getMonth(), totalDays:tempDateDays.getDate(), calendarArray:calendar, totalCells:totalCells});
          
        } else if (type === "next") {
          
          const tempDate = new Date(ym.year, ym.month + 1);
          console.log(tempDate.getMonth())
          const [numberOfDay] = getStartDay(tempDate);
          const tempDateDays = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0); //이번달의 마지막 날 구하기
          const [calendar, totalCells] = generateCalendarData(tempDate.getFullYear(), tempDate.getMonth() , tempDateDays.getDate(), numberOfDay);
          setYm({ year: tempDate.getFullYear(), month: tempDate.getMonth(), totalDays:tempDateDays.getDate(), calendarArray:calendar, totalCells:totalCells });

        } else {

          const tempDate = new Date();
          const [numberOfDay] = getStartDay(tempDate);
          const tempDateDays = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0);
          const [calendar, totalCells] = generateCalendarData(tempDate.getFullYear(), tempDate.getMonth() , tempDateDays.getDate(), numberOfDay);
          setYm({ year: tempDate.getFullYear(), month: tempDate.getMonth(), totalDays:tempDateDays.getDate(), calendarArray:calendar, totalCells:totalCells});
        
        }

    }


  /** 날짜 비교 (start와 end는 Date타입, func는 최종리턴시 날짜비교의 연산자를 목적에 맞게 사용하기 위해 콜백으로 함), 
   Date comparison (start and end are of type Date; func is a callback used to apply the appropriate comparison operator when returning the final result)
  */
  function compareDate(start, end, func){
  
    const startDate = start.getFullYear() + String(start.getMonth()).padStart(2, '0') + String(start.getDate()).padStart(2, '0');
    const endDate = end.getFullYear() + String(end.getMonth()).padStart(2, '0') + String(end.getDate()).padStart(2, '0');
    const returnVal = func(startDate, endDate);
    
    return returnVal;

  }


  // function 
  /** Day컴포넌트에서 room요소를 선택할 때 발생하는 이벤트 함수,
   An event handler function triggered when a room element is selected in the Day component */
  function roomClickEvent(e){

    const dataset = e.target.dataset;

    if(selectDayRef.current.start.day && selectDayRef.current.end.day)
      selectDayRef.current = {start:{year:null, month:null, day:null, room:null}, end:{year:null, month:null, day:null, room:null}};

    if(!selectDayRef.current.start.day){
        
        selectDayRef.current.start = {year:dataset.year, month:dataset.month, day:dataset.day, room:dataset.room};
        setSelectedStart({year:dataset.year, month:dataset.month, day:dataset.day});
      
      }else if(selectDayRef.current.start.day && !selectDayRef.current.end.day){
        
        const startDate = new Date(selectDayRef.current.start.year, selectDayRef.current.start.month, selectDayRef.current.start.day);
        const endDate = new Date(dataset.year, dataset.month, dataset.day);
        
        if(selectDayRef.current.start.room !== dataset.room){
          alert(data.alerts.differentMsg);
          return;
        }else if(!compareDate(startDate, endDate, (start, end) => {return start <= end})){
          alert(data.alerts.selectErrorMsg);
          return;
        }
        
        selectDayRef.current.end = {year:dataset.year, month:dataset.month, day:dataset.day, room:dataset.room};
      
      }


      if(selectDayRef.current.start.day && selectDayRef.current.end.day){
        selectDayRef.current.roomId = dataset.room;
        const startDate = new Date(selectDayRef.current.start.year , selectDayRef.current.start.month ,selectDayRef.current.start.day);
        const endDate = new Date(selectDayRef.current.end.year , selectDayRef.current.end.month , selectDayRef.current.end.day);
        updateSelectionRange(startDate, endDate);
        
    }

  }

  // function
  /** 예약할 날짜가 모두 선택되면 cancel버튼이 활성화 되는데 그 버튼을 클릭 시 이벤트,
      An event triggered when the cancel button, which becomes active after all reservation dates are selected, is clicked 
   */ 
  function cancelClickEvent() {
    selectDayRef.current = {start:{year:null, month:null, day:null, room:null}, end:{year:null, month:null, day:null, room:null}};
    const startDate = new Date(selectDayRef.current.start.year , selectDayRef.current.start.month ,selectDayRef.current.start.day);
    const endDate = new Date(selectDayRef.current.end.year , selectDayRef.current.end.month , selectDayRef.current.end.day);
    updateSelectionRange(startDate, endDate);
  }


  /** function 인자는 Date객체 */
  function updateSelectionRange(startDate, endDate){
    const [minDate, maxDate] = startDate <= endDate ? [startDate, endDate] : [endDate, startDate];

    const updatedArray = ym.calendarArray.map((item) => {
      const itemDate = new Date(item.year, item.month, item.day);
      const isInRange = itemDate >= minDate && itemDate <= maxDate;

      return {
        ...item,
        isSelected: isInRange,
        isSelectedStartDay: compareDate(startDate, itemDate, (start, end) => { return start === end }) ? true : false,
        isSelectedLastDay: compareDate(endDate, itemDate, (start, end) => { return start === end }) ? true : false 
      };
    });

    setYm({...ym, updatedArray});
  };


  return [ym, moveMonth, roomClickEvent, cancelClickEvent, selectedStart, selectDayRef];


} //end useGetDay()

// function
/** 현재 month의 1일이 무슨 요일인지 반환, Returns the day of the week for the 1st day of the current month  */ 
function getStartDay(date){
    
    const returnDate = new Date(date.getFullYear(), date.getMonth(), 1);

    return [returnDate.getDay()];
  
}


// function
/** 인자(년도, 월, 해당월의 총일자, 시작요일)이며 달력이 나타나거나 month가 변경되면 요일정보를 세팅하는 함수, 
 A function that takes arguments (year, month, total days of the month, starting weekday) and sets the weekday information whenever the calendar is displayed or the month changes */ 
function generateCalendarData(year, month, daysInMonth, startDay) {
  
  let totalCells = 35; // 기본 7*5 고정
  
  if((daysInMonth > 29 && startDay === 6) || (daysInMonth > 30 && startDay === 5)){
    totalCells = 42;
  }
  // init calendar Array
  const calendar = [];
  // roomId Array
  const roomArr = ['room1', 'room2', 'room3'];
  
  // 전월 마지막날짜
  const prevMonthLastDay = new Date(year, month, 0);

  // 전월 날짜
  for (let i = startDay - 1; i >= 0; i--) {
    calendar.push({
      roomArr : roomArr,
      year : prevMonthLastDay.getFullYear(),
      month : prevMonthLastDay.getMonth(),
      day: prevMonthLastDay.getDate() - i,
      currentMonth: false,
      isSelected: false,
      isSelectedLastDay: false
    });
  }

  // 이번 달 날짜
  for (let d = 1; d <= daysInMonth; d++) {
    calendar.push({
      roomArr : roomArr,
       year : year,
      month : month,
      day: d,
      currentMonth: true,
      isSelected: false,
      isSelectedLastDay: false
    });
  }

  // 다음 달 날짜
 const nextMonthLastDay = new Date(year, month+1, 1);
  let nextDay = 1;
  while (calendar.length < totalCells) {
    calendar.push({
      roomArr : roomArr,
      year : nextMonthLastDay.getFullYear(),
      month : nextMonthLastDay.getMonth(),
      day: nextDay++,
      currentMonth: false,
      isSelected: false,
      isSelectedLastDay: false
    });
  }
  return [calendar, totalCells];
}



const Calendar = () => {
  
  const [ym, moveMonth, roomClickEvent, cancelClickEvent, selectedStart, selectDayRef] = useGetDay();
   
  
  useEffect(() => {
    // 처음 마운트 될 때 날짜정보 표시 하기 위해서 호출
    // Called to display date information when the component is first mounted
    moveMonth({type:""});
  }, []);


  return (
    <>
    <div className="wrapper flex flex-col h-screen">
      <div className="w-full flex justify-center items-center gap-10 mb-4">
        <button
          onClick={() => { moveMonth({ type: "pre" }); }}
          className="bg-red-400 hover:bg-red-300 w-10 h-10">
          {"<"}
        </button>

        <span>
          {ym.year}.{ym.month + 1}
        </span>

        <button
          onClick={() => { moveMonth({ type: "next" }); }}
          className="bg-red-400 hover:bg-red-300 w-10 h-10">
          {">"}
        </button>

        <span className="cursor-pointer" onClick={() => {moveMonth({type:"today"})}} >
          오늘
        </span>
      
      </div>

      
         <div
          className="grid grid-cols-7 border-r-[2px] border-black bg-red-400"
          style={{
              backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
              backgroundSize: "calc(100% / 7) 100%",
          }}
        >
        
          {data.dayArray.map((item, idx) => (
            <div className="p-2 flex justify-center items-center" key={idx}>{item}</div>
          ))}

      </div>

     <div className=
      { ym.totalCells > 35 ? "flex-1 grid grid-cols-7 grid-rows-6 border-b-2 border-r-2 border-b-black border-r-black":
                             "flex-1 grid grid-cols-7 grid-rows-5 border-b-2 border-r-2 border-b-black border-r-black"}
    style={{
    backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
    backgroundSize: ym.totalCells > 35 ? "calc(100% / 7) calc(100% / 6)" : "calc(100% / 7) calc(100% / 5)",
  }} >
  
  {Array.isArray(ym.calendarArray) && ym.calendarArray.map((item, idx) => (
      <div key={idx} className="w-full h-full">
        <Day
          dateProps={{year : item.year, month: item.month, currentMonth:item.currentMonth, day:item.day}}
          roomProps={{roomArr : item.roomArr}}
          selectProps={{isSelected : item.isSelected,
                        isSelectedLastDay : item.isSelectedLastDay, roomId:selectDayRef.current.roomId,
                      }}
          seletedStartProps={
              {sYear : selectedStart.year, sMonth: selectedStart.month, sDay: selectedStart.day,
                sRoom : selectDayRef.current.start.room
              }
          }
          eventProps={{roomClickEvent, cancelClickEvent}}
        />
      </div>
    ))}
</div>

    </div>
    </>
  );
};

export default Calendar;
