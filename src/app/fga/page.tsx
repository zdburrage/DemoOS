import DocumentList from "../components/DocumentList";


export default async function FGAPage() {
    
    return (
        <main>
            <h1 className="mt-0">Documents</h1>
            <div className="space-y-4 w-2/3">
            <DocumentList/>
            </div>
        </main>
    )
}