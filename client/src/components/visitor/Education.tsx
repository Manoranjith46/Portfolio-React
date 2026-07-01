import { useEducation } from '@/api/portfolio'

const Education = () => {
  const { data: qualifications } = useEducation()

  return (
    <section id="education">
      <div className="section__header">
        <h2 className="sub__title">
          <span className="primary">Educational Qualifications</span>
        </h2>
      </div>
      <div className="edus">
        {qualifications.map((qualification, index) => (
          <div key={qualification.id ?? index} className="edu">
            <div className="flex user">
              <div className="details">
                <h2 className="name">{qualification.title}</h2>
                <h4 className="name">{qualification.institute}</h4>
                <div className="flex row">
                  <p className="text__muted position">
                    {qualification.gradeType ?? (index === 2 ? 'CGPA' : 'Percentage')} : {qualification.percent}
                  </p>
                  <p className="primary company">Year Of Pasing : {qualification.yearOfPassing}</p>
                </div>
              </div>
            </div>
            <p className="text__muted content"></p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Education
