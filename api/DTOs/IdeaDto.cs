using System;

namespace IdeaHub.DTOs
{
    public class IdeaDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string UserId { get; set; }
        public int? GroupId { get; set; }
        public DateTime CreatedAt { get; set; }
        public int VoteCount { get; set; }
    }
}
