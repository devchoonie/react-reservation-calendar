
const Day = ({dateProps, selectProps, roomProps, seletedStartProps, eventProps}) => {
  // 해당 컴포넌트가 가지고 있는 년월일 정보, currentMonth는 현재월을 표시
  // The year, month, and day information held by the component; currentMonth indicates the current month
  const {year, currentMonth, month, day} = dateProps;
  // 이 컴포넌트가 선택된건지, 마지막날짜인지, 선택한 room 값
  // Whether this component is selected, whether it is the last date, and the value of the selected room
  const {isSelected, isSelectedLastDay, roomId} = selectProps;
  // Day 컴포넌트마다 세팅하기 위한 room 값
  // The room value to be set for each Day component
  const { roomArr } = roomProps;
  // 시작날짜 클릭 시 선택된 date정보
  // The selected date information when the start date is clicked
  const {sYear, sMonth, sDay, sRoom} = seletedStartProps; 
  // Calendar컴포넌트에 정의된 events를 이 컴포넌트에서 사용하기 위함
  // To use the events defined in the Calendar component within this component
  const {roomClickEvent, cancelClickEvent} = eventProps;
  
  // 시작 날짜 클릭 시 색상변경
  // Change color when the start date is clicked
  const isSelectedStart = year == sYear && month == sMonth && day == sDay; 

  return (
    <> 
      <div className="w-full h-full box-border pl-[1px] pt-[1px]">
        <div className={`w-full h-full px-2`}>
          <span
            className={`text-[14px] text-ellipsis ${
              currentMonth ? "" : "text-gray-400"
            }`}
          >
             {day}
            <div className="grid gap-y-2 text-[12px]">
              
              {roomArr.map((item, idx)=>{
                  return <div key={idx} className="flex items-center cursor-pointer w-auto truncate overflow-hidden whitespace-nowrap">
              
                <div
                  data-room={item}
                  className={`hover:underline truncate whitespace-nowrap 
                    ${(isSelected && item === roomId) || (isSelectedStart && item === sRoom) ? 'text-red-400' : ''}`}
                  onClick={roomClickEvent}
                  data-year={year}
                  data-month={month}
                  data-day={day}
                >
                  {item}
                </div>

                <div className={isSelected && !isSelectedLastDay && item === roomId ? "flex-grow border-b border-black ml-2" : ""}></div>
                <button className={`${isSelected && isSelectedLastDay && item === roomId ? "" : "hidden"} hover:no-underline border-x-[1px] border-y-[1px] ml-2 px-1`}
                onClick={cancelClickEvent}
                >cancel</button>
              </div>
              })}
              

            </div>
          </span>
        </div>
      </div>
    </>
  );
};

export default Day;
