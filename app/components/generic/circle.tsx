export const Circle = ({className="", color='red', text="", entireText="", borderActive=false, textColor='black', size="5", fontSize="16"}:{color: string, text?: string, textColor?:string, borderActive?:boolean, size?: string, className?: string, fontSize?: string, entireText?:string}) => {
  return (
      <div>
          <div className={`${className} flex-none rounded-full bg-green-400/10 text-green-400 ${borderActive ? 'border-2 border-black' : ''}`} style={{ color }}>
              <div className={`h-${size} w-${size} rounded-full bg-current text-center`}>
                  <span className="text-black text-center font-bold" style={{fontSize: fontSize+"px", color: textColor}}>
                      {text.at(0)} 
                      <span style={{marginBottom:'10px'}}>
                          {entireText}
                      </span>
                  </span>
              </div>
          </div>
      </div>
  )
}