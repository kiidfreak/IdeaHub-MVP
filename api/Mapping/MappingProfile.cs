// Mapping/MappingProfile.cs
using AutoMapper;
using IdeaHub.DTOs;
using IdeaHub.Models;

namespace IdeaHub.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User mappings
            CreateMap<User, UserDto>();
            CreateMap<RegisterDto, User>();
            CreateMap<User, UserProfileDto>();

            // Idea mappings
            CreateMap<Idea, IdeaDto>();
            CreateMap<CreateIdeaDto, Idea>();
            CreateMap<UpdateIdeaDto, Idea>();

            // Project mappings
            CreateMap<Project, ProjectDto>();
            CreateMap<CreateProjectDto, Project>();
            CreateMap<UpdateProjectDto, Project>();

            // Group mappings
            CreateMap<Group, GroupDto>();
            CreateMap<CreateGroupDto, Group>();
            CreateMap<UpdateGroupDto, Group>();
        }
    }
}