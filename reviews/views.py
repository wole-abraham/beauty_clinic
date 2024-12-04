from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Review

# Create your views here.


@login_required
def review(request):
    if request.method == 'POST':
        user = request.user
        comment = request.POST.get('comment')
        Review.objects.create(
            user=user,
            comment=comment,
        )

        review = Review.objects.all()
    return render(request, 'new/landing.html', {'reviews': review})
