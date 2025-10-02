# 7. Deployment Strategy

Date: 2025-09-24

## Status

- Accepted by: Dennis, Jakob, Marie, Anna
- Discussed with: Julian, Niko, Daniel, Volker, Chris

## Context

The Elterngeldrechner is part of the Familienportal, which is managed via a content management system operated by a hosting partner.

Until now, releasing a new version involved uploading the artifact to a sharepoint folder and notifying our hosting partner.
Typically, they would include it in their next scheduled release, which could take several days or weeks, or publish it next to immediately,
if we requested a hotfix.

This process was slow, relied on manual communication (and thus occasionally some delays due to illnesses, holidays etc.), and had the additional drawback
that we never knew exactly when a release would go live. This uncertainty was especially problematic for releases that required deploying a new version
of the matomo container, which required the new version to be live.

To work around this, we previously appended the last commit hash to the bundle and set up a github action that checked
hourly whether the new commit had gone live and notified us accordingly. While effective, this solution added unnecessary
complexity.

### Potential Scenarios

In August, we reached out to the hosting partner to introduce ourselves as new engineers in the team and explore opportunities
to optimize the process. After several discussions, the following scenarios emerged.

#### 1. Deployment via HTTP or SFTP

Deploying files via HTTP or SFTP, supported by Core Media, seemed the most obvious solution. Unfortunately, security limitations is the system of the
hosting partner prevented the team that we contacted from setting up such an interface.

#### 2. Hosting a Web Server on Hosting Partner’s Side

Setting up a web server on the hosting partner’s infrastructure to serve files directly from our pipeline was considered, but
organizational constraints made this infeasible.

#### 3. Hosting a Web Server on our Side

The cms supports both direct file uploads and configuration of an external url to serve files. Hosting the elterngeldrechner
on our platform would allow automatic release of every commit, aligning with our trunk-based development practices.

However, this approach introduces several challenges:

- Contractual changes and legal processes would be required
- Responsibility for uptime monitoring and firefighting
- Platform costs would need reallocation

Although technically feasible, these organizational and contractual obstacles make this option impractical.

#### 4. Hosting via CMS with Access (Chosen Approach)

Our partner granting us direct access to the content management system allows our team to deploy static files independently,
decoupling releases from the hosting partner’s release cycle. Uploading takes only a minute, enabling rapid iteration
without the need for constant coordination.

This approach also removes unnecessary steps:

- Manual email communication is eliminated
- Hourly release checks are no longer required
- Version hashes in the bundle are no longer needed
- No legal adjustments or contract changes are required
- We do not need to monitor uptime or handle firefighting

**Trade-offs:**

- Automatic deployment on push is not yet possible
- Developers need cms access and vpn credentials
- Developers must know how to publish releases

## Decision

We will, for now, deploy the Elterngeldrechner using **direct cms access**, enabling the team to publish static files ourselves. This approach:

- Resolves the main release bottlenecks
- Supports faster iteration and shorter release cycles
- Minimizes organizational and legal overhead while maintaining release control
