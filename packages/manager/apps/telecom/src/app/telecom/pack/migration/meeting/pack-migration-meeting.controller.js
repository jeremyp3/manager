import get from 'lodash/get';

export default class TelecomPackMigrationMeetingCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    OvhApiConnectivityEligibility,
    OvhApiConnectivityEligibilitySearch,
    TucPackMigrationProcess,
    TucToast,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.OvhApiConnectivityEligibility = OvhApiConnectivityEligibility;
    this.OvhApiConnectivityEligibilitySearch = OvhApiConnectivityEligibilitySearch;
    this.TucPackMigrationProcess = TucPackMigrationProcess;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.selectedMeeting = {
      meetingSlots: {
        fakeMeeting: false,
        slot: null,
      },
    };
    this.contactName = null;
    this.showMeetingSlots = false;
    this.meetingSlots = {};

    this.process = this.TucPackMigrationProcess.getMigrationProcess();
    this.buildingReference = this.process.selectedOffer.buildingReference;

    this.loading = true;
    this.meetings = [];
    return this.OvhApiConnectivityEligibility.v6()
      .testBuilding(this.$scope, { building: this.buildingReference })
      .then((eligibility) => {
        if (eligibility.result) {
          const { eligibilityReference } = eligibility.result;
          const productCode = eligibility.result.offers[0].product.code;
          this.process.selectedOffer.address =
            eligibility.result.endpoint.address;
          return this.OvhApiConnectivityEligibilitySearch.v6()
            .searchMeetings(this.$scope, {
              eligibilityReference,
              productCode,
            })
            .then((data) => {
              if (data.result) {
                this.meetingSlots.canBookFakeMeeting =
                  data.result.canBookFakeMeeting;
                this.meetingSlots.slots = data.result.meetingSlots;

                let slots = [];
                let prevTitle;
                data.result.meetingSlots.forEach((slot, index) => {
                  const title = moment(slot.startDate).format(
                    'ddd DD MMM YYYY',
                  );
                  if (!prevTitle) {
                    prevTitle = title;
                  } else if (prevTitle !== title) {
                    this.meetings.push({
                      title: prevTitle,
                      slots,
                    });
                    slots = [];
                    prevTitle = title;
                  }
                  slots.push({
                    id: index,
                    start: slot.startDate,
                    end: slot.endDate,
                    startTime: moment(slot.startDate).format('HH:mm'),
                    endTime: moment(slot.endDate).format('HH:mm'),
                    selected: false,
                  });
                });
                this.showMeetingSlots = true;
                this.meetingSelectMessage = '';
              }
            });
        }
        return null;
      })
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telecom_pack_migration_meeting_error',
          )} ${get(error, 'data.message', '')}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  checkConfirm() {
    const checkContact = !!this.contactName;
    const checkSlot = this.selectedMeeting.meetingSlots.slot !== null;
    return !(checkContact && checkSlot);
  }

  selectSlot(slotId) {
    this.selectedMeeting.meetingSlots.fakeMeeting = this.meetingSlots.canBookFakeMeeting;
    this.selectedMeeting.meetingSlots.slot = this.meetingSlots.slots[slotId];

    const day = moment(this.selectedMeeting.meetingSlots.slot.startDate).format(
      'DD/MM/YYYY',
    );
    const start = moment(
      this.selectedMeeting.meetingSlots.slot.startDate,
    ).format('HH:mm');
    const end = moment(this.selectedMeeting.meetingSlots.slot.endDate).format(
      'HH:mm',
    );
    this.meetingSelectMessage = this.$translate.instant(
      'telecom_pack_migration_programmed_meeting',
      {
        day: `<strong>${day}</strong>`,
        start: `<strong>${start}</strong>`,
        end: `<strong>${end}</strong>`,
      },
    );
  }

  nextStep() {
    this.TucPackMigrationProcess.setSelectedMeeting(
      this.selectedMeeting.meetingSlots,
      this.contactName,
    );
  }
}
