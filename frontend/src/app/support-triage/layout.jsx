// app/support-triage/layout.jsx
export const metadata = {
    title: 'Support Triage System Demo',
    description: 'Test our AI-powered support triage workflow',
  };
  
  export default function SupportTriageLayout({ children }) {
    return (
      <div className="support-triage-layout">
        {children}
      </div>
    );
  }