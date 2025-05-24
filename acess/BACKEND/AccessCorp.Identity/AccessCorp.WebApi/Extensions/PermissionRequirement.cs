using Microsoft.AspNetCore.Authorization;

namespace AccessCorp.WebApi.Extensions;


public class PermissionRequirement : IAuthorizationRequirement
{
    public string RequiredPermission { get; }

    public PermissionRequirement(string permission)
    {
        RequiredPermission = permission;
    }
}

public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        if (context.User.HasClaim(c => c.Type == "Permission" && c.Value == requirement.RequiredPermission))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}