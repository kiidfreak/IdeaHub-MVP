using System;

namespace IdeaHub.DTOs
{
    public class ProjectDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string CreatedByUserId { get; set; }
        public string OverseenByUserId { get; set; }
        public int? IdeaId { get; set; }
        public int? GroupId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
