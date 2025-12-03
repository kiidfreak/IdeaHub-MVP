namespace IdeaHub.DTOs
{
    public class CreateIdeaDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int? GroupId { get; set; }
    }
}
