
export default function PdfView({ pdf }: { pdf: string }) {

    return (
        <div
            className="rpv-core__viewer"
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <iframe src={pdf} style={{ width: '100%', height: '100%' }} />
            </div>
        </div>
    )
}