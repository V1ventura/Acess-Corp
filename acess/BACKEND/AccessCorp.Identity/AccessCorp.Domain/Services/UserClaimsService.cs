using System.Security.Claims;
using AccessCorp.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace AccessCorp.Domain.Services;

public class UserClaimsService : IUserClaimsService
{
    private readonly UserManager<IdentityUser> _userManager;

    public UserClaimsService(UserManager<IdentityUser> userManager)
    {
        _userManager = userManager;
    }
    public async Task AddPermissionClaimAsync(IdentityUser user, string permission)
    {
        var claim = new Claim("Permission", permission);
        await _userManager.AddClaimAsync(user, claim);
    }

    public async Task<bool> HasAdmimClaims(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        
        if(user == null) return false;
        
        var claims = await _userManager.GetClaimsAsync(user);
        var hasAdminClaim = claims.Any(c => c.Type == "Permission" && c.Value == "FullAccess");
        
        return hasAdminClaim;
    }

    public async Task<bool> HasDoormanClaims(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        
        if (user == null) return false;
        
        var claims = await _userManager.GetClaimsAsync(user);
        var hasDoormanClaim = claims.Any(c => c.Type == "Permission" && c.Value == "LimitedAccess");
        
        return hasDoormanClaim;
    }
}