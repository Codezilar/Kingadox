import { ReactNode } from "react"

const RootLayout = ({children}:{children: ReactNode}) => {
  return (
    <div className='auth'>
      <div className="auth-container">
        <div className="auth-top">
          <h1>Kingadox Bank</h1>  
          <p>Secure digital banking platform</p>
        </div>
        {children}
      </div>
    </div>
  )
}

export default RootLayout