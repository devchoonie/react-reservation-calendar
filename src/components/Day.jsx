
const Day = ({dateProps, selectProps, roomProps, seletedStartProps, eventProps}) => {
  
  const {year, currentMonth, month, day} = dateProps;
  const {isSelected, isSelectedLastDay, roomId} = selectProps;
  const { roomArr } = roomProps;
  const {sYear, sMonth, sDay, sRoom} = seletedStartProps; 
  const {roomClickEvent, cancelClickEvent} = eventProps;
  
  // 최초 날짜 클릭 시 색상변경
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
