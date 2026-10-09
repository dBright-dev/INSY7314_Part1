const STATUS = {
    pending: { label: 'Pending', cls: 'status-new' },
    confirmed: { label: 'Confirmed', cls: 'status-confirmed' },
    completed: { label: 'Completed', cls: 'status-confirmed' },
    cancelled: { label: 'Cancelled', cls: '' },
};

// viewAs = 'client'     -> shows the freelancer's name
// viewAs = 'freelancer' -> shows the client's name
export default function BookingCard({ booking, viewAs = 'client' }) {
    const gig = booking.gig || {}; // populated gig can be null if it was deleted
    const other = viewAs === 'freelancer' ? booking.client : booking.freelancer;
    const date = new Date(booking.date || booking.createdAt);
    const validDate = !Number.isNaN(date.getTime());
    const status = STATUS[booking.status] || STATUS.pending;

    return (
        <div className="booking-row">
            <div className="date-tile">
                <strong>{validDate ? date.getDate() : '–'}</strong>
                <small>{validDate ? date.toLocaleString('en-ZA', { month: 'short' }).toUpperCase() : ''}</small>
            </div>
            <div className="booking-info">
                <strong>{gig.title || 'Gig no longer available'}</strong>
                <small>
                    {viewAs === 'freelancer' ? 'Client' : 'Freelancer'}: {other?.name || 'Unknown'}
                </small>
            </div>
            {gig.price != null && <strong>R {Number(gig.price).toLocaleString('en-ZA')}</strong>}
            <span className={`status ${status.cls}`}>{status.label}</span>
        </div>
    );
}