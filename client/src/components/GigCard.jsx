export default function GigCard({ gig, onBook, canBook = true }) {
    const name = gig.owner?.name || 'Freelancer';
    const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

    return (
        <article className="service-card">
            <div className="service-body">
                <span className="service-tag">{gig.category}</span>
                <div className="creator-row">
                    <span className="avatar">{initials}</span>
                    <strong>{name}</strong>
                </div>
                <h3>{gig.title}</h3>
                <p>{gig.description}</p>
            </div>
            <div className="service-footer">
                <span>From <strong>R {Number(gig.price).toLocaleString('en-ZA')}</strong></span>
                {canBook && (
                    <button className="select-button" onClick={() => onBook(gig)}>
                        Book
                    </button>
                )}
            </div>
        </article>
    );
}