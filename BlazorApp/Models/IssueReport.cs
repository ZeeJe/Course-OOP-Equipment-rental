namespace BlazorApp.Models
{
    public class IssueReport
    {
        public int Id { get; set; }
        public int TransportId { get; set; }
        public string TransportStateCode { get; set; } = "";
        public string Description { get; set; } = "";
        public string ReportTime { get; set; } = "";
        public bool IsResolved { get; set; } = false;
    }
}