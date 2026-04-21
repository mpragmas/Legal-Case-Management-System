import { useState, useEffect } from "react";
import { Star, MessageSquare, Send } from "lucide-react";
import { api } from "../services/api";

export function ReviewSection({ lawyerId, isClient }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [lawyerId]);

  const fetchReviews = async () => {
    try {
      const data = await api.getReviewsByLawyer(lawyerId);
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);
    try {
      await api.createReview(lawyerId, rating, comment);
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (error) {
      alert("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {isClient && (
        <form onSubmit={handleSubmit} className="bg-surface-50 p-4 rounded-xl border border-surface-200">
          <h4 className="text-sm font-bold text-surface-900 mb-3 flex items-center gap-2">
            <MessageSquare size={16} className="text-primary-600" />
            Leave a Review
          </h4>
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className={`p-1 transition-colors ${s <= rating ? "text-amber-400" : "text-surface-300 hover:text-surface-400"}`}
              >
                <Star size={20} fill={s <= rating ? "currentColor" : "none"} />
              </button>
            ))}
            <span className="text-xs font-bold text-surface-500 ml-2">{rating}/5 Stars</span>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describe your experience with this lawyer..."
            className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white min-h-[100px] resize-none"
          />
          <button
            type="submit"
            disabled={loading || !comment.trim()}
            className="mt-3 w-full py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <Send size={16} />
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        <h4 className="text-sm font-black text-surface-900 uppercase tracking-widest flex items-center gap-2">
          Reviews ({reviews.length})
        </h4>
        {reviews.length === 0 ? (
          <p className="text-sm text-surface-400 italic text-center py-4 bg-surface-50 rounded-xl border border-dashed border-surface-200">
            No reviews yet
          </p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 rounded-xl border border-surface-100 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-surface-900">{r.clientName}</p>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} fill={i < r.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-surface-600 leading-relaxed">{r.comment}</p>
                <p className="text-[10px] text-surface-400 mt-2">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
