using System;

namespace IdeaHub.DTOs
{
    public class UpdateProjectDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string OverseenByUserId { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
