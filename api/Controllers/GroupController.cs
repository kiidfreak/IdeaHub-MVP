using api.Data;
using api.Models;
using api.Helpers;
using api.Constants;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GroupController : ControllerBase
{
    private readonly ILogger<GroupController> _logger;
    private readonly IdeahubDbContext _context;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<IdeahubUser> _userManager;

    public GroupController(ILogger<GroupController> logger, IdeahubDbContext context, RoleManager<IdentityRole> roleManager, UserManager<IdeahubUser> userManager)
    {
        _logger = logger;
        _context = context;
        _roleManager = roleManager;
        _userManager = userManager;
    }

    //Create A Group
    [HttpPost("create-group")]
    public async Task<IActionResult> CreateGroup(GroupDto groupDto)
    {
        _logger.LogInformation("Group creation starting ...");

        //Fetch user from database
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            _logger.LogError("Group creation failed. User ID not found.");
            return BadRequest(ApiResponse.Fail("Group creation failed. User ID Not Found"));
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
        {
            _logger.LogError("User not found");
            return NotFound(ApiResponse.Fail("User not found"));
        }

        // Check if user is already a member of any group
        var existingGroupMembership = await _context.UserGroups
            .AnyAsync(ug => ug.UserId == userId);

        if (existingGroupMembership)
        {
            _logger.LogWarning("User {userEmail} cannot create a group because they are already a member of another group.", user.Email);
            return BadRequest(ApiResponse.Fail("You are already a member of a group. You must leave your current group before creating a new one."));
        }

        //Create the group
        var group = new Group
        {
            Name = groupDto.Name,
            Description = groupDto.Description,
            CreatedByUserId = userId
        };

        //Find user email
        var userEmail = User.FindFirstValue(ClaimTypes.Email) ?? "Email unknown";

        //Store the group in database
        _context.Groups.Add(group);
        await _context.SaveChangesAsync();

        //Change user's role to group admin
        var groupAdmin = await _roleManager.FindByNameAsync(RoleConstants.GroupAdmin);
        if (groupAdmin is null)
        {
            _logger.LogError("Role 'Group Admin' doesn't exist");
            return NotFound(ApiResponse.Fail("Group 'Group Admin' not found"));
        }

        //Make user an admin if they're not one already
        var isInRole = await _userManager.IsInRoleAsync(user, RoleConstants.GroupAdmin);
        if (!isInRole)
        {
            var result = await _userManager.AddToRoleAsync(user, RoleConstants.GroupAdmin);
            if (!result.Succeeded)
            {
                _logger.LogError("Failed to make {userEmail} group admin", userEmail);
                return BadRequest(ApiResponse.Fail($"Failed to make {userEmail} group admin", result.Errors.Select(e => e.Description).ToList()));
            }
            _logger.LogInformation("User {userEmail} made Group Admin", userEmail);
        }

        //put the user in the group and save changes
        await _context.UserGroups.AddAsync(new UserGroup { GroupId = group.Id, UserId = user.Id });
        await _context.SaveChangesAsync();

        _logger.LogInformation("New group {groupName} created by {userEmail}", group.Name, userEmail);
        return Ok(ApiResponse.Ok($"New group {group.Name} created by {userEmail}"));
    }

    //Delete Group
    [Authorize(Policy = "GroupAdminOnly")]
    [HttpDelete("{groupId}")]
    public async Task<IActionResult> DeleteGroup(int groupId)
    {
        //Fetch user info
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var userEmail = User.FindFirstValue(ClaimTypes.Email) ?? "Email not found";

        if (string.IsNullOrWhiteSpace(userId))
        {
            _logger.LogError("User not authenticated");
            return Unauthorized(ApiResponse.Fail("User not authenticated"));
        }

        //Find the group
        var group = await _context.Groups.FindAsync(groupId);
        if (group is null)
        {
            _logger.LogError("Group with ID '{groupId}' not found", groupId);
            return BadRequest(ApiResponse.Fail("Group not found"));
        }

        //Let user delete group if they're admin
        _context.Groups.Remove(group);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Group '{groupName}' has been deleted by '{userEmail}' ", group.Name, userEmail);
        return Ok(ApiResponse.Ok($"{group.Name} has been deleted by {userEmail}"));
    }

    //Update Group
    [Authorize(Policy = "GroupAdminOnly")]
    [HttpPut("{groupId}")]
    public async Task<IActionResult> UpdateGroup(int groupId, [FromBody] GroupDto groupDto)
    {
        //Fetch user info
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(ApiResponse.Fail("User not authenticated"));
        }

        //Find the group
        var group = await _context.Groups.FindAsync(groupId);
        if (group is null)
        {
            return NotFound(ApiResponse.Fail("Group not found"));
        }

        // Update properties
        group.Name = groupDto.Name;
        group.Description = groupDto.Description;

        _context.Groups.Update(group);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse.Ok("Group updated successfully", group));
    }

    //Show Groups
    [HttpGet("view-groups")]
    public async Task<IActionResult> ViewGroups()
    {
        // Get current user ID from JWT token
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (string.IsNullOrWhiteSpace(currentUserId))
        {
            _logger.LogError("User not authenticated");
            return Unauthorized(ApiResponse.Fail("User not authenticated"));
        }

        // Fetch groups with membership status for current user
        var groups = await _context.Groups
            .Select(g => new 
            {
                g.Id,
                g.Name,
                g.Description,
                g.IsActive,
                g.CreatedAt,
                g.CreatedByUserId,
                CreatedByUser = new 
                {
                    g.CreatedByUser.DisplayName,
                    g.CreatedByUser.Email
                },
                
                // CRITICAL: Check if current user is a member
                IsMember = _context.UserGroups
                    .Any(ug => ug.GroupId == g.Id && ug.UserId == currentUserId),
                
                // Check if user has pending request
                HasPendingRequest = _context.GroupMembershipRequests
                    .Any(gmr => gmr.GroupId == g.Id && 
                               gmr.UserId == currentUserId && 
                               gmr.Status == Status.Pending),
                
                // Get member count
                MemberCount = _context.UserGroups.Count(ug => ug.GroupId == g.Id),
                
                // Get idea count (if you have Ideas table)
                IdeaCount = _context.Ideas.Count(i => i.GroupId == g.Id)
            })
            .ToListAsync();

        if (groups == null || !groups.Any())
        {
            _logger.LogWarning("No groups found");
            return Ok(ApiResponse.Ok("No groups found", new List<object>()));
        }

        _logger.LogInformation("Retrieved {count} joined groups for user {userId}", groups.Count, currentUserId);
        return Ok(ApiResponse.Ok("Groups retrieved successfully", groups));
    }

    //Join Group
    [HttpPost("join-group")]
    public async Task<IActionResult> JoinGroup(int groupId)
    {
        // Get user info
        var userEmail = User.FindFirstValue(ClaimTypes.Email) ?? "Email not found";
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            _logger.LogError("User not authenticated to join group");
            return Unauthorized(ApiResponse.Fail("User not authenticated to join group"));
        }

        // Get group info
        var group = await _context.Groups.FindAsync(groupId);
        if (group is null)
        {
            _logger.LogError("Group not found");
            return NotFound(ApiResponse.Fail("Group not found"));
        }
        var groupName = group.Name;

        // Check if user is ALREADY A MEMBER (in UserGroups)
        var isAlreadyMember = await _context.UserGroups
            .AnyAsync(ug => ug.GroupId == groupId && ug.UserId == userId);
        
        if (isAlreadyMember)
        {
            _logger.LogWarning("User {userEmail} is already a member of group {GroupName}", userEmail, groupName);
            return BadRequest(ApiResponse.Fail("You are already a member of this group"));
        }

        // Check if user already has a PENDING request
        var hasPendingRequest = await _context.GroupMembershipRequests
            .AnyAsync(gmr => gmr.GroupId == groupId && 
                           gmr.UserId == userId && 
                           gmr.Status == Status.Pending);
        
        if (hasPendingRequest)
        {
            _logger.LogWarning("User {userEmail} already has a pending request for group {GroupName}", userEmail, groupName);
            return BadRequest(ApiResponse.Fail("You already have a pending request to join this group"));
        }

        // Create a PENDING request (not immediate membership)
        var request = new GroupMembershipRequest
        {
            UserId = userId,
            GroupId = groupId,
            Status = Status.Pending,
            RequestedAt = DateTime.UtcNow
        };

        _context.GroupMembershipRequests.Add(request);
        await _context.SaveChangesAsync();

        _logger.LogInformation("User {userEmail} requested to join group {groupName} (pending approval)", userEmail, groupName);
        return Ok(ApiResponse.Ok($"Join request sent to group {groupName}. Waiting for admin approval."));
    }

    //Leave Group
    [HttpPost("leave-group")]
    public async Task<IActionResult> LeaveGroup(int groupId)
    {
        //Get user info
        var userEmail = User.FindFirstValue(ClaimTypes.Email) ?? "Email not found";
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            _logger.LogError("User not found");
            return NotFound(ApiResponse.Fail("User Not Found"));
        }

        //Get group info
        var group = await _context.Groups.FindAsync(groupId);
        if (group is null)
        {
            _logger.LogError("Group doesn't exist");
            return NotFound(ApiResponse.Fail("Group not found"));
        }
        var groupName = group.Name;

        //Verify user is in group
        if (!_context.UserGroups.Any(ug => ug.UserId == userId && ug.GroupId == groupId))
        {
            return BadRequest(ApiResponse.Fail("You can't leave a group you're not a part of"));
        }

        //Remove them and save the new changes
        var userGroup = await _context.UserGroups.FirstOrDefaultAsync(ug => ug.UserId == userId && ug.GroupId == groupId);
        if (userGroup is null)
        {
            _logger.LogWarning("UserGroup entry doesn't exist");
            return BadRequest(ApiResponse.Fail("Group membership doesn't exist"));
        }
        _context.UserGroups.Remove(userGroup);
        await _context.SaveChangesAsync();

        _logger.LogInformation("User {userEmail} has left group {groupName}", userEmail, groupName);
        return Ok(ApiResponse.Ok($"User {userEmail} has left group {groupName}"));
    }

    //View Individual Group
    [HttpGet("{groupId}")]
    public async Task<IActionResult> ViewGroup(int groupId)
    {
        var group = await _context.Groups
            .Include(g => g.CreatedByUser)
            .Include(g => g.UserGroups)
            .FirstOrDefaultAsync(g => g.Id == groupId);
        if (group is null)
        {
            _logger.LogError("Group not found");
            return NotFound(ApiResponse.Fail("Group not found"));
        }

        _logger.LogInformation("Group {groupName} found", group.Name);
        return Ok(ApiResponse.Ok($"Group {group.Name} found", new
        {
            group.Name,
            group.Description,
            CreatedBy = new
            {
                group.CreatedByUser.DisplayName,
                group.CreatedByUser.Email
            },
            Members = group.UserGroups.Select(ug => new
            {
                ug.User?.DisplayName,
                ug.User?.Email
            }),
            group.CreatedAt
        }));
    }

    //View group requests
    [Authorize(Policy = "GroupAdminOnly")]
    [HttpGet("view-requests")]
    public async Task<IActionResult> ViewRequests(int groupId)
    {
        //Fetch user
        var userEmail = User.FindFirstValue(ClaimTypes.Email) ?? "User's email not found";
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            _logger.LogError("User Id is null and cant accept requests");
            return NotFound(ApiResponse.Fail("User ID is null"));
        }

        //Fetch group
        var group = await _context.Groups.FindAsync(groupId);
        if (group is null)
        {
            _logger.LogError("Group is null");
            return NotFound(ApiResponse.Fail("Group is null"));
        }

        //show pending requests if they're not null
        var pendingRequests = await _context.GroupMembershipRequests
            .Where(gmr => gmr.GroupId == groupId && gmr.Status.ToString() == "Pending")
            .ToListAsync();
        if (pendingRequests is null)
        {
            _logger.LogError("There are no pending requests for group: {groupName} from user {userEmail}", group.Name, userEmail);
            return NotFound(ApiResponse.Fail("No pending requests"));
        }
        var req = new List<string>();
        foreach (var request in pendingRequests)
        {
            var requestUserId = request.UserId;
            _logger.LogInformation("Requests: {userId}", requestUserId);
            req.Add(requestUserId);
        }

        _logger.LogInformation("The group has {pendingRequestsCount} pending requests", pendingRequests.Count());
        return Ok(ApiResponse.Ok($"{pendingRequests.Count()} Pending requests found", req));
    }

    //Accept Request
    [Authorize(Policy = "GroupAdminOnly")]
    [HttpPost("accept-request")]
    public async Task<IActionResult> AcceptRequest(string requestUserId, int groupId)
    {
        //Fetch user
        var userEmail = User.FindFirstValue(ClaimTypes.Email) ?? "User's email not found";
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            _logger.LogError("User Id is null and cant accept requests");
            return NotFound(ApiResponse.Fail("User ID is null"));
        }

        //Fetch group
        var group = await _context.Groups.FindAsync(groupId);
        if (group is null)
        {
            _logger.LogError("Group is null");
            return NotFound(ApiResponse.Fail("Group is null"));
        }

        //Fetch request
        var userRequest = await _context.GroupMembershipRequests
            .FirstOrDefaultAsync(gmr => gmr.UserId == requestUserId && gmr.GroupId == groupId && gmr.Status == Status.Pending);

        if (userRequest is null)
        {
            _logger.LogError("Request not found");
            return NotFound(ApiResponse.Fail("Request not found"));
        }

        // Accept the request
        userRequest.Status = Status.Approved;

        // check if user is already in group
        var isAMember = await _context.UserGroups
            .AnyAsync(ug =>
                ug.GroupId == groupId
                && ug.UserId == requestUserId);

        if (isAMember)
        {
            _logger.LogError("User {userEmail} is already a member of group: {groupName}",
                User.FindFirstValue(ClaimTypes.Email) ?? "Email not found", group.Name);
            return BadRequest(ApiResponse.Fail("User is already a member of the group"));
        }

        // Check if user is a member of ANY other group
        var isMemberOfAnyGroup = await _context.UserGroups
            .AnyAsync(ug => ug.UserId == requestUserId);

        if (isMemberOfAnyGroup)
        {
            _logger.LogWarning("User {requestUserId} is already a member of another group", requestUserId);
            return BadRequest(ApiResponse.Fail("User is already a member of another group. They must leave their current group first."));
        }

        // Add user to group and save
        _context.UserGroups.Add(new UserGroup { UserId = requestUserId, GroupId = groupId });
        await _context.SaveChangesAsync();

        _logger.LogInformation("User {requestUserId} has been accepted into group {groupName}", requestUserId, group.Name);
        return Ok(ApiResponse.Ok($"User {requestUserId} has been accepted into group {group.Name}"));
    }

    //Reject Request
    [Authorize(Policy = "GroupAdminOnly")]
    [HttpPost("reject-request")]
    public async Task<IActionResult> RejectRequest(string requestUserId, int groupId)
    {
        //Fetch user
        var userEmail = User.FindFirstValue(ClaimTypes.Email) ?? "User's email not found";
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            _logger.LogError("User Id is null and cant accept requests");
            return NotFound(ApiResponse.Fail("User ID is null"));
        }

        //Fetch group
        var group = await _context.Groups.FindAsync(groupId);
        if (group is null)
        {
            _logger.LogError("Group is null");
            return NotFound(ApiResponse.Fail("Group is null"));
        }

        //Fetch request
        var userRequest = await _context.GroupMembershipRequests
            .FirstOrDefaultAsync(gmr => gmr.UserId == requestUserId && gmr.GroupId == groupId && gmr.Status == Status.Pending);

        if (userRequest is null)
        {
            _logger.LogError("Request not found");
            return NotFound(ApiResponse.Fail("Request not found"));
        }

        // Reject the request
        userRequest.Status = Status.Rejected;
        await _context.SaveChangesAsync();

        _logger.LogInformation("User {requestUserId} has been rejected from group {groupName}", requestUserId, group.Name);
        return Ok(ApiResponse.Ok($"User {requestUserId} has been rejected from group {group.Name}"));
    }
}