/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePresolvedAudit = /* GraphQL */ `
  subscription OnCreatePresolvedAudit(
    $filter: ModelSubscriptionPresolvedAuditFilterInput
    $tenantId: String
  ) {
    onCreatePresolvedAudit(filter: $filter, tenantId: $tenantId) {
      id
      tenantId
      resource
      action
      byUser
      byDateTime
      changesMade
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePresolvedAudit = /* GraphQL */ `
  subscription OnUpdatePresolvedAudit(
    $filter: ModelSubscriptionPresolvedAuditFilterInput
    $tenantId: String
  ) {
    onUpdatePresolvedAudit(filter: $filter, tenantId: $tenantId) {
      id
      tenantId
      resource
      action
      byUser
      byDateTime
      changesMade
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePresolvedAudit = /* GraphQL */ `
  subscription OnDeletePresolvedAudit(
    $filter: ModelSubscriptionPresolvedAuditFilterInput
    $tenantId: String
  ) {
    onDeletePresolvedAudit(filter: $filter, tenantId: $tenantId) {
      id
      tenantId
      resource
      action
      byUser
      byDateTime
      changesMade
      createdAt
      updatedAt
    }
  }
`;
export const onCreateClientSignup = /* GraphQL */ `
  subscription OnCreateClientSignup(
    $filter: ModelSubscriptionClientSignupFilterInput
    $id: String
  ) {
    onCreateClientSignup(filter: $filter, id: $id) {
      id
      name
      email
      phone
      company
      address
      city
      state
      zip
      country
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateClientSignup = /* GraphQL */ `
  subscription OnUpdateClientSignup(
    $filter: ModelSubscriptionClientSignupFilterInput
    $id: String
  ) {
    onUpdateClientSignup(filter: $filter, id: $id) {
      id
      name
      email
      phone
      company
      address
      city
      state
      zip
      country
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteClientSignup = /* GraphQL */ `
  subscription OnDeleteClientSignup(
    $filter: ModelSubscriptionClientSignupFilterInput
    $id: String
  ) {
    onDeleteClientSignup(filter: $filter, id: $id) {
      id
      name
      email
      phone
      company
      address
      city
      state
      zip
      country
      createdAt
      updatedAt
    }
  }
`;
export const onCreateClientUsers = /* GraphQL */ `
  subscription OnCreateClientUsers(
    $filter: ModelSubscriptionClientUsersFilterInput
    $tenantId: String
  ) {
    onCreateClientUsers(filter: $filter, tenantId: $tenantId) {
      id
      tenantId
      name
      email
      role
      status
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateClientUsers = /* GraphQL */ `
  subscription OnUpdateClientUsers(
    $filter: ModelSubscriptionClientUsersFilterInput
    $tenantId: String
  ) {
    onUpdateClientUsers(filter: $filter, tenantId: $tenantId) {
      id
      tenantId
      name
      email
      role
      status
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteClientUsers = /* GraphQL */ `
  subscription OnDeleteClientUsers(
    $filter: ModelSubscriptionClientUsersFilterInput
    $tenantId: String
  ) {
    onDeleteClientUsers(filter: $filter, tenantId: $tenantId) {
      id
      tenantId
      name
      email
      role
      status
      createdAt
      updatedAt
    }
  }
`;
export const onCreateClientIntergrations = /* GraphQL */ `
  subscription OnCreateClientIntergrations(
    $filter: ModelSubscriptionClientIntergrationsFilterInput
    $tenantId: String
  ) {
    onCreateClientIntergrations(filter: $filter, tenantId: $tenantId) {
      id
      tenantId
      mstenantId
      loginMS
      consentMS
      attributes
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateClientIntergrations = /* GraphQL */ `
  subscription OnUpdateClientIntergrations(
    $filter: ModelSubscriptionClientIntergrationsFilterInput
    $tenantId: String
  ) {
    onUpdateClientIntergrations(filter: $filter, tenantId: $tenantId) {
      id
      tenantId
      mstenantId
      loginMS
      consentMS
      attributes
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteClientIntergrations = /* GraphQL */ `
  subscription OnDeleteClientIntergrations(
    $filter: ModelSubscriptionClientIntergrationsFilterInput
    $tenantId: String
  ) {
    onDeleteClientIntergrations(filter: $filter, tenantId: $tenantId) {
      id
      tenantId
      mstenantId
      loginMS
      consentMS
      attributes
      createdAt
      updatedAt
    }
  }
`;
export const onCreateClientUserWhitelisting = /* GraphQL */ `
  subscription OnCreateClientUserWhitelisting(
    $filter: ModelSubscriptionClientUserWhitelistingFilterInput
    $tenantId: String
  ) {
    onCreateClientUserWhitelisting(filter: $filter, tenantId: $tenantId) {
      id
      tenantId
      groupId
      groupUser {
        id
        tenantId
        name
        description
        users {
          nextToken
        }
        createdAt
        updatedAt
      }
      displayName
      businessPhones
      givenName
      jobTitle
      mail
      mobilePhone
      officeLocation
      preferredLanguage
      surname
      userPrincipalName
      uid
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateClientUserWhitelisting = /* GraphQL */ `
  subscription OnUpdateClientUserWhitelisting(
    $filter: ModelSubscriptionClientUserWhitelistingFilterInput
    $tenantId: String
  ) {
    onUpdateClientUserWhitelisting(filter: $filter, tenantId: $tenantId) {
      id
      tenantId
      groupId
      groupUser {
        id
        tenantId
        name
        description
        users {
          nextToken
        }
        createdAt
        updatedAt
      }
      displayName
      businessPhones
      givenName
      jobTitle
      mail
      mobilePhone
      officeLocation
      preferredLanguage
      surname
      userPrincipalName
      uid
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteClientUserWhitelisting = /* GraphQL */ `
  subscription OnDeleteClientUserWhitelisting(
    $filter: ModelSubscriptionClientUserWhitelistingFilterInput
    $tenantId: String
  ) {
    onDeleteClientUserWhitelisting(filter: $filter, tenantId: $tenantId) {
      id
      tenantId
      groupId
      groupUser {
        id
        tenantId
        name
        description
        users {
          nextToken
        }
        createdAt
        updatedAt
      }
      displayName
      businessPhones
      givenName
      jobTitle
      mail
      mobilePhone
      officeLocation
      preferredLanguage
      surname
      userPrincipalName
      uid
      createdAt
      updatedAt
    }
  }
`;
export const onCreateClientCallLogs = /* GraphQL */ `
  subscription OnCreateClientCallLogs(
    $filter: ModelSubscriptionClientCallLogsFilterInput
    $tenantId: String
  ) {
    onCreateClientCallLogs(filter: $filter, tenantId: $tenantId) {
      tenantId
      callRecordId
      callType
      callStartTime
      callEndTime
      callDuration
      charge
      callerNumber
      calleeNumber
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateClientCallLogs = /* GraphQL */ `
  subscription OnUpdateClientCallLogs(
    $filter: ModelSubscriptionClientCallLogsFilterInput
    $tenantId: String
  ) {
    onUpdateClientCallLogs(filter: $filter, tenantId: $tenantId) {
      tenantId
      callRecordId
      callType
      callStartTime
      callEndTime
      callDuration
      charge
      callerNumber
      calleeNumber
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteClientCallLogs = /* GraphQL */ `
  subscription OnDeleteClientCallLogs(
    $filter: ModelSubscriptionClientCallLogsFilterInput
    $tenantId: String
  ) {
    onDeleteClientCallLogs(filter: $filter, tenantId: $tenantId) {
      tenantId
      callRecordId
      callType
      callStartTime
      callEndTime
      callDuration
      charge
      callerNumber
      calleeNumber
      createdAt
      updatedAt
    }
  }
`;
export const onCreateClientUsersGroup = /* GraphQL */ `
  subscription OnCreateClientUsersGroup(
    $filter: ModelSubscriptionClientUsersGroupFilterInput
    $tenantId: String
  ) {
    onCreateClientUsersGroup(filter: $filter, tenantId: $tenantId) {
      id
      tenantId
      name
      description
      users {
        items {
          id
          tenantId
          groupId
          displayName
          businessPhones
          givenName
          jobTitle
          mail
          mobilePhone
          officeLocation
          preferredLanguage
          surname
          userPrincipalName
          uid
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateClientUsersGroup = /* GraphQL */ `
  subscription OnUpdateClientUsersGroup(
    $filter: ModelSubscriptionClientUsersGroupFilterInput
    $tenantId: String
  ) {
    onUpdateClientUsersGroup(filter: $filter, tenantId: $tenantId) {
      id
      tenantId
      name
      description
      users {
        items {
          id
          tenantId
          groupId
          displayName
          businessPhones
          givenName
          jobTitle
          mail
          mobilePhone
          officeLocation
          preferredLanguage
          surname
          userPrincipalName
          uid
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteClientUsersGroup = /* GraphQL */ `
  subscription OnDeleteClientUsersGroup(
    $filter: ModelSubscriptionClientUsersGroupFilterInput
    $tenantId: String
  ) {
    onDeleteClientUsersGroup(filter: $filter, tenantId: $tenantId) {
      id
      tenantId
      name
      description
      users {
        items {
          id
          tenantId
          groupId
          displayName
          businessPhones
          givenName
          jobTitle
          mail
          mobilePhone
          officeLocation
          preferredLanguage
          surname
          userPrincipalName
          uid
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
