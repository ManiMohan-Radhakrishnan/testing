import "./style.scss";
// skeleton 1
const Skeleton1 = () => {
  return <div className="skeleton1"></div>;
};

// Referal page
export const ReferralLoader = () => {
  return (
    <>
      <secttion className="referral-section">
        <article className="refer-link-band-heading">
          <div className="refer-breadcrumb"></div>
          <div className="refer-link-band content-ldr"></div>
        </article>
        <div className=" container-fluid">
          <div className="row g-3">
            <div className="col-12">
              <div className="referal--flex combine-card">
                <div className="referal--box content-hyt">
                  <Skeleton1 />
                </div>
                <div className="referal--box content-hyt">
                  <Skeleton1 />
                </div>
              </div>
            </div>
          </div>
        </div>
      </secttion>
    </>
  );
};
