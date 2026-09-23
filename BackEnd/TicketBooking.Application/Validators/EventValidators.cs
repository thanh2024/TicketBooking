using FluentValidation;
using TicketBooking.Application.DTOs.Events;

namespace TicketBooking.Application.Validators;

public class CreateEventRequestValidator : AbstractValidator<CreateEventRequest>
{
    public CreateEventRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(256);
        RuleFor(x => x.Location).NotEmpty().MaximumLength(512);
        RuleFor(x => x.CategoryId).NotEmpty();
        
        RuleFor(x => x.StartTime)
            .NotEmpty()
            .GreaterThan(DateTime.UtcNow).WithMessage("Start time must be in the future.");

        RuleFor(x => x.EndTime)
            .NotEmpty()
            .GreaterThan(x => x.StartTime).WithMessage("End time must be after start time.");

        RuleForEach(x => x.TicketTypes).SetValidator(new CreateTicketTypeRequestValidator());
    }
}

public class CreateTicketTypeRequestValidator : AbstractValidator<CreateTicketTypeRequest>
{
    public CreateTicketTypeRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
        RuleFor(x => x.TotalQuantity).GreaterThan(0);
        
        RuleFor(x => x.SaleStartTime).NotEmpty();
        RuleFor(x => x.SaleEndTime)
            .NotEmpty()
            .GreaterThan(x => x.SaleStartTime).WithMessage("Sale end time must be after sale start time.");
    }
}
