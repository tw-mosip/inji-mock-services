import { useState, useEffect } from "react";
import { TruckpassRequestStepper } from "./TruckpassRequestStepper";
import magnifierIcon from "../../assets/magnifier_icon.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import relyingPartyService from "../../services/relyingPartyService";
import Tooltip from "../../components/Tooltip";

export const SearchDriver = () => {
  const { t } = useTranslation("");
  const navigate = useNavigate();
  const [searchDriverStatus, setSearchDriverStatus] = useState(false);
  const [searchByUin, setSearchByUin] = useState(true);
  const [selectedriver, setSelectedriver] = useState<any>(null);
  const [uin, setUin] = useState("");
  const [uinErrorMsg, setUinErrorMsg] = useState("");
  const [searchByName, setSearchByName] = useState(false);
  const [driversList, setDriversList] = useState<DriverList[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { get_driver_information } = {
    ...relyingPartyService,
  };

  // const driversList = [
  //   { id: 1, name: "Rajesh Singh", uin: "34234242542524", license: "DL-9876543210" },
  //   { id: 2, name: "Driver 1", uin: "24254342342524", license: "DL-9876543210" },
  //   { id: 3, name: "Driver 2", uin: "42425434232524", license: "DL-9876543210" },
  //   { id: 4, name: "Driver 3", uin: "34242534242524", license: "DL-9876543210" },
  //   { id: 5, name: "Driver 4", uin: "23423442542524", license: "DL-9876543210" },
  //   { id: 6, name: "Driver 5", uin: "42425425234234", license: "DL-9876543210" },
  //   { id: 7, name: "Driver 6", uin: "10254252434232", license: "DL-9876543210" },
  // ];

  const selectSearchByName = () => {
    setSearchByName(true);
    setSearchByUin(false);
  };

  const selectSearchByUin = () => {
    setSearchByName(false);
    setSearchByUin(true);
  };

  const handleUinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setUin(value);
  };

  const fetchDriversByUin = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await get_driver_information("driverUin", uin);
      if (response.data && response.data.length > 0) {
        setSelectedriver(response.data[0]);
      } else {
        setError("No driver found with this UIN.");
      }
    } catch (err) {
      setError("Error fetching driver by UIN.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDriversByName = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await get_driver_information("fullname", search)
      setDriversList(response.data || []);
    } catch (err) {
      setError("Error fetching drivers by name.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchByName && search.length > 2) {
      fetchDriversByName();
    }
  }, []);

  const moveToDriverProfile = async () => {
    if (searchByUin) {
      setUinErrorMsg("");
      if (uin.length < 12) {
        if (uin.length === 0) {
          setUinErrorMsg(t("searchDriver.uinErrorMsg2"));
          return;
        }
        setUinErrorMsg(t("searchDriver.uinErrorMsg1"));
        return;
      }
      await fetchDriversByUin();

      if (!selectedriver) return;
    }

    setSearchDriverStatus(true);
    localStorage.setItem('selectedDriver', JSON.stringify(selectedriver));
    navigate("/requestTruckpassProcess/driverProfile");
  };

  return (
    <div className="flex flex-col gap-y-10 bg-transparent font-inter">
      <TruckpassRequestStepper
        searchDriverStatus={searchDriverStatus}
        driverProfileStatus={false}
        consignmentDetailsStatus={false}
        vehicleDetailsStatus={false}
        journeyDetailsStatus={false}
        reviewAndSubmitStatus={false}
      />

      <div className="bg-[#FFFFFF] h-auto px-8 py-3 rounded-lg shadow-md space-y-16">
        {/* Header */}
        <div className="flex flex-col gap-y-2">
          <div className="flex space-x-5 items-center">
            <img src={magnifierIcon} className="h-4.5" />
            <h1 className="font-[600] text-[18px]">{t("searchDriver.header")}</h1>
          </div>
          <p className="text-sm">{t("searchDriver.subHeader")}</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-around bg-[#FAFAFA] border border-[#E9EAEB] py-1 rounded-lg">
          <div
            onClick={selectSearchByUin}
            className={`${searchByUin
              ? "bg-[#ECF5FF] border border-[#006DE7]"
              : "border border-[#E4E7EC]"
              } text-center py-[8px] w-[49.5%] rounded-sm hover:shadow-md cursor-pointer`}
          >
            <p className="font-[600] text-[14px] text-[#414651]">
              {t("searchDriver.searchByUin")}
            </p>
          </div>
          <div
            onClick={selectSearchByName}
            className={`${searchByName
              ? "bg-[#ECF5FF] border border-[#006DE7]"
              : "border border-[#E4E7EC]"
              } text-center py-[8px] w-[49.5%] rounded-sm hover:shadow-md cursor-pointer`}
          >
            <p className="font-[600] text-[14px] text-[#414651]">
              {t("searchDriver.searchByName")}
            </p>
          </div>
        </div>

        {/* Search By UIN */}
        {searchByUin && (
          <div className="space-y-3">
            <label className="flex items-center gap-1">
              <p className="text-sm text-[#414651]">
                {t("searchDriver.enterDriverUin")}
                <span className="text-[#006DE7]">*</span>
              </p>
              <Tooltip helpText={t('searchDriver.searchByUinToolTip')} />
            </label>
            <input
              type="text"
              pattern="[0-9]*"
              placeholder={t("searchDriver.uinPlaceHolder")}
              maxLength={12}
              value={uin}
              onChange={handleUinChange}
              className={`${!uin ? "bg-[#FAFAFA] text-[#717680]" : "bg-[#FFFFFF]"
                } text-[15px] p-2 w-full border ${uinErrorMsg ? "border-[#FDA29B]" : "border-[#D5D7DA]"
                } rounded-md outline-none`}
            />
            {uinErrorMsg && (
              <p className="text-xs text-[#D92D20]">{uinErrorMsg}</p>
            )}
            {error && <p className="text-xs text-[#D92D20]">{error}</p>}

          </div>
        )}

        {/* Search By Name */}
        {searchByName && (
          <div className="space-y-3 relative">
            <label className="flex items-center gap-1">
              <p className="text-sm text-[#414651]">
                {t("searchDriver.enterDriverName")}
                <span className="text-[#006DE7]">*</span>
              </p>
              <Tooltip helpText={t('searchDriver.searchByNameToolTip')} />
            </label>
            <input
              type="text"
              placeholder={t("searchDriver.driverName")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[15px] p-2 w-full border border-[#D5D7DA] rounded-md outline-none"
            />

            {(search.length > 1)
              && (
                <ul className="absolute z-10 bg-white border border-[#D5D7DA] w-full rounded-md max-h-40 overflow-y-auto shadow-md">
                  {driversList
                    .filter((driver) =>
                      driver.fullName.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((driver) => (
                      <div
                        key={driver.id}
                        onClick={() => {
                          setSelectedriver(driver);
                          setSearch(driver.fullName);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row items-center justify-between"
                      >
                        <span className="text-base text-[#181D27] font-[500] w-[280px] break-words">{driver.fullName}</span>
                        <span className="text-base text-gray-500 font-[500]">{t('searchDriver.uin')} {driver.uin} </span>
                        <span className="text-base text-gray-500 font-[500]">{t('searchDriver.licenseNum')}{driver.driverLicenseNumber} </span>
                      </div>
                    ))}
                </ul>
              )}
            {/* No matches */}
            {driversList.filter((driver) =>
              driver.fullName.toLowerCase().includes(search.toLowerCase())
            ).length === 0 && error && (
                <p className="text-xs text-[#D92D20]">{t('searchDriver.nameErrorMsg')}</p>
              )}
          </div>
        )}

        {loading && <p className="text-sm text-gray-500 mt-2">{t('selectCompany.loading')}</p>}

        {/* Button */}
        <div className="flex space-x-6 justify-end my-6">
          <button
            disabled={
              (searchByUin && uin.length === 0) ||
              (searchByName && !selectedriver)
            }
            onClick={moveToDriverProfile}
            className={`bg-[#006DE7] text-white w-[221px] h-[35px] text-sm font-[600] py-2.5 text-center rounded-[5px] cursor-pointer disabled:opacity-50 disabled:cursor-default`}
          >
            {t("searchDriver.searchBtn")}
          </button>
        </div>
      </div>
    </div >
  );
};

interface DriverList {
 id?: number;
  fullName: string;
  gender?: string;
  uin?: string;
  phoneNumber?: string;
  emailId?: string;
  city?: string
  passportNumber?: string;
  driverLicenseNumber?: string;
  faceImagePath?: string
};