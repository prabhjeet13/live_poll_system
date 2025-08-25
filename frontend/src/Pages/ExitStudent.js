import React from 'react'

function ExitStudent() {
  return (
    <div className="flex flex-col items-center p-1 gap-3 m-2">
        <h3 className="text-center border-2 border-primary bg-accent text-white font-bold rounded-full w-32">Intervue Poll</h3>
        <p className='text-3xl font-bold'>You've been Kicked out!</p>
        <p className='text-md text-grayLight'>Looks like the teacher had removed you from the poll syste. Please Try again sometime</p>
    </div>
  )
}

export default ExitStudent