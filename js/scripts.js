/*!
 * Start Bootstrap - New Age v6.0.7 (https://startbootstrap.com/theme/new-age)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-new-age/blob/master/LICENSE)
 */
//
// Scripts
//

window.addEventListener('DOMContentLoaded', (event) => {
    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav')
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74
        })
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler')
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    )
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click()
            }
        })
    })

    // Contact form handler
    document
        .getElementById('contactForm')
        .addEventListener('submit', function (e) {
            e.preventDefault()

            const name = document.getElementById('name').value.trim()
            const email = document.getElementById('email').value.trim()
            const phone = document.getElementById('phone').value.trim()
            const message = document.getElementById('message').value.trim()

            const subject = encodeURIComponent('New Contact Form Submission')
            const body = encodeURIComponent(
                `Name: ${name}
Phone: ${phone}
Email: ${email}
Message:
${message}`
            )

            const to = 'contact@ethpar.com'

            window.location.href = `mailto:${to}?subject=${subject}&body=${body}`
        })
})
