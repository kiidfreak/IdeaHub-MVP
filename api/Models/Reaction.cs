using System.ComponentModel.DataAnnotations;

namespace IdeaHub.Models
{
    public class Reaction
    {
        public int Id { get; set; }
        
        [Required]
        public string Type { get; set; }  // e.g., "like", "love", "laugh", etc.
        
        // Relationships
        public string UserId { get; set; }
        public User User { get; set; }
        
        public int IdeaId { get; set; }
        public Idea Idea { get; set; }
    }
}