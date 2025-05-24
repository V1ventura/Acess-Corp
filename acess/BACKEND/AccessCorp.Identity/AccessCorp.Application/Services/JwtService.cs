using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AccessCorp.Application.Entities;
using AccessCorp.Application.Interfaces;
using AccessCorp.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace AccessCorp.Application.Services;

public class JwtService : IJwtService
{
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly AppSettings _appSettings;
    private readonly ICepValidationService _cepValidationService;
    
    public JwtService(SignInManager<IdentityUser> signInManager, 
                      UserManager<IdentityUser> userManager,
                      IOptions<AppSettings> appSettings,
                      ICepValidationService cepValidationService)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _appSettings = appSettings.Value;
        _cepValidationService = cepValidationService;
    }
    
    public async Task<AdministratorResponseVM> GenerateJWTAdmin(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        var claims = await _userManager.GetClaimsAsync(user);

        var identityClaims = await GetAdminClaims(claims, user);
        var encodedToken = CodeToken(identityClaims);
         
        return GetTokenAdminResponse(encodedToken, user, claims);
    }

    private async Task<ClaimsIdentity> GetAdminClaims(ICollection<Claim> claims, IdentityUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        
        // Claims para o JWT
        claims.Add(new Claim(JwtRegisteredClaimNames.Sub, user.Id));
        claims.Add(new Claim(JwtRegisteredClaimNames.Email, user.Email));
        claims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
        claims.Add(new Claim(JwtRegisteredClaimNames.Nbf, ToUnixEpochDate(DateTime.UtcNow).ToString()));
        claims.Add(new Claim(JwtRegisteredClaimNames.Iat, ToUnixEpochDate(DateTime.UtcNow).ToString(), ClaimValueTypes.Integer64));

        foreach (var userRole in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, userRole));
        }
        var identityClaims = new ClaimsIdentity();
        identityClaims.AddClaims(claims);
        
        return identityClaims;
    }
    
    private string CodeToken(ClaimsIdentity identityClaims)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenKey = Encoding.ASCII.GetBytes(_appSettings.Secret);

        var token = tokenHandler.CreateToken(new SecurityTokenDescriptor
        {
            Issuer = _appSettings.Emissor,
            Audience = _appSettings.ValidoEm,
            Subject = identityClaims,
            Expires = DateTime.UtcNow.AddHours(_appSettings.ExpiracaoHoras),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey),
                SecurityAlgorithms.HmacSha256Signature)
        }); 
         
        var encodedToken = tokenHandler.WriteToken(token);
        
        return encodedToken;
    }
    
    private AdministratorResponseVM GetTokenAdminResponse(string encodedToken, IdentityUser user, IEnumerable<Claim> claims)
    {
        return new AdministratorResponseVM
        {
            AccessToken = encodedToken,
            ExpiresIn = TimeSpan.FromHours(_appSettings.ExpiracaoHoras).TotalSeconds,
            AdministratorToken = new AdministratorToken
            {
                Id = user.Id,
                Email = user.Email,
                Claims = claims.Select(c => new AdministratorClaim { Type = c.Type, Value = c.Value })
            }
        };
    }
    
    public async Task<DoormanResponseVM> GenerateJWTDoorman(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        var claims = await _userManager.GetClaimsAsync(user);

        var identityClaims = await GetDoormanClaims(claims, user);
        var encodedToken = CodeToken(identityClaims);
         
        return GetTokenDoormanResponse(encodedToken, user, claims);    
    }

    private async Task<ClaimsIdentity> GetDoormanClaims(ICollection<Claim> claims, IdentityUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        
        // Claims para o JWT
        claims.Add(new Claim(JwtRegisteredClaimNames.Sub, user.Id));
        claims.Add(new Claim(JwtRegisteredClaimNames.Email, user.Email));
        claims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
        claims.Add(new Claim(JwtRegisteredClaimNames.Nbf, ToUnixEpochDate(DateTime.UtcNow).ToString()));
        claims.Add(new Claim(JwtRegisteredClaimNames.Iat, ToUnixEpochDate(DateTime.UtcNow).ToString(), ClaimValueTypes.Integer64));

        foreach (var userRole in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, userRole));
        }
        var identityClaims = new ClaimsIdentity();
        identityClaims.AddClaims(claims);
        
        return identityClaims;
    }
    
    private DoormanResponseVM GetTokenDoormanResponse(string encodedToken, IdentityUser user, IEnumerable<Claim> claims)
    {
        return new DoormanResponseVM
        {
            AccessToken = encodedToken,
            ExpiresIn = TimeSpan.FromHours(_appSettings.ExpiracaoHoras).TotalSeconds,
            DoormanToken = new DoormanToken()
            {
                Id = user.Id,
                Email = user.Email,
                Claims = claims.Select(c => new DoormanClaim() { Type = c.Type, Value = c.Value })
            }
        };
    }
    
    
    
    private static long ToUnixEpochDate(DateTime date)
        => (long)Math.Round((date.ToUniversalTime() - new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero)).TotalSeconds);

}