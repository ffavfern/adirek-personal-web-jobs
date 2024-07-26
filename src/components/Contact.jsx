

function Contact() {
  return (
    <>
    <section className="contact flex flex-col min-h-screen justify-center items-center">
        <div className="flex title uppercase">get in touch</div>
        <div className="flex form_and_socials flex-row justify-between">
            <div className="flex form_contact w-full h-full border">
                <form action="">
                    <h6 className="uppercase">email</h6>
                    <input type="email" name="email" id="email" />
                    <h6 className="uppercase">message</h6>
                    <input type="text" name="message" id="message" />
                </form>
            </div>
            <div className="flex socials justify-between w-full">
                <a href="#" className="facebook">facebook</a>
                <a href="#" className="linkedin">linkedin</a>
            </div>
        </div>
    </section>
    </>
  )
}

export default Contact